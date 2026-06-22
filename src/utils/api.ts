import { getAccessToken, getRefreshToken, setTokens } from './auth';
import {
  INGREDIENTS_ENDPOINT,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  ORDERS_ENDPOINT,
  PASSWORD_RESET_CONFIRM_ENDPOINT,
  PASSWORD_RESET_ENDPOINT,
  REGISTER_ENDPOINT,
  TOKEN_ENDPOINT,
  USER_ENDPOINT,
} from './constants';

import type {
  AuthData,
  AuthResponse,
  ConfirmPasswordResetPayload,
  Ingredient,
  IngredientsResponse,
  LoginPayload,
  Order,
  OrderByNumberResponse,
  OrderResponse,
  RegisterPayload,
  TokenResponse,
  UpdateUserPayload,
  User,
  UserResponse,
} from './types';

// Парсит JSON-ответ, проверяет HTTP-статус и поле success.
// Любой провал превращается в Error с понятным сообщением.
const checkResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let message = `Ошибка ${response.status}`;
    try {
      const body = await response.json();
      if (body.message) {
        message = body.message;
      }
    } catch {
      // тело не json или пустое
    }
    throw new Error(message);
  }
  const result = (await response.json()) as T & {
    success: boolean;
    message?: string;
  };
  if (!result.success) {
    throw new Error(result.message || 'Запрос завершился с success: false');
  }
  return result;
};

// Обновление пары токенов по refreshToken.
// POST /auth/token { token: refreshToken } -> новые accessToken/refreshToken.
// Сразу сохраняем их в localStorage.
export const refreshToken = async (): Promise<TokenResponse> => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
  const result = await checkResponse<TokenResponse>(response);
  setTokens({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
  return result;
};

// Опции для fetchWithRefresh. Требуем headers как plain object, чтобы
// при ретрае можно было заменить поле authorization без union-плясок
// с HeadersInit (он же Headers | string[][] | Record<string,string>).
type FetchWithRefreshInit = RequestInit & { headers: Record<string, string> };

// Обёртка над fetch для запросов, требующих авторизации.
// accessToken живёт 20 минут: если он истёк, сервер вернёт ошибку
// «jwt expired». Тогда обновляем токен и повторяем исходный запрос
// уже с новым accessToken. Прочие ошибки пробрасываем наверх.
export const fetchWithRefresh = async <T>(
  url: string,
  options: FetchWithRefreshInit
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    return await checkResponse<T>(response);
  } catch (err) {
    if (err instanceof Error && err.message === 'jwt expired') {
      const refreshData = await refreshToken();
      options.headers.authorization = refreshData.accessToken;
      const response = await fetch(url, options);
      return await checkResponse<T>(response);
    }
    return Promise.reject(err);
  }
};

export const getIngredients = async (): Promise<Ingredient[]> => {
  const response = await fetch(INGREDIENTS_ENDPOINT);
  const result = await checkResponse<IngredientsResponse>(response);
  return result.data;
};

// GET /api/orders/{number} — получить один заказ по номеру.
// Используется как fallback: WS-лента отдаёт max 50 последних заказов,
// и при прямом переходе на /feed/:id или /profile/orders/:id нужный
// заказ может не оказаться в снапшоте. Эндпоинт публичный (без авторизации).
export const getOrderByNumber = async (number: number | string): Promise<Order> => {
  const response = await fetch(`${ORDERS_ENDPOINT}/${number}`);
  const result = await checkResponse<OrderByNumberResponse>(response);
  // API возвращает массив; берём первый (он же единственный для конкретного номера).
  return result.orders[0];
};

export const createOrder = async (ingredientIds: string[]): Promise<number> => {
  // Создание заказа требует авторизации — передаём accessToken
  // и пропускаем запрос через fetchWithRefresh (обновит токен при истечении).
  const result = await fetchWithRefresh<OrderResponse>(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken() ?? '',
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });
  return result.order.number;
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthData> => {
  const response = await fetch(REGISTER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await checkResponse<AuthResponse>(response);
  return {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
};

export const loginUser = async (payload: LoginPayload): Promise<AuthData> => {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await checkResponse<AuthResponse>(response);
  return {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
};

export const logoutUser = async (refresh: string): Promise<void> => {
  const response = await fetch(LOGOUT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refresh }),
  });
  await checkResponse(response);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  const response = await fetch(PASSWORD_RESET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  await checkResponse(response);
};

export const confirmPasswordReset = async (
  payload: ConfirmPasswordResetPayload
): Promise<void> => {
  const response = await fetch(PASSWORD_RESET_CONFIRM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  await checkResponse(response);
};

// GET /auth/user — данные текущего пользователя.
// Чек-лист: «При получении и обновлении информации о пользователе серверу
// передаётся токен в поле authorization». Через fetchWithRefresh, чтобы
// на старте приложения протухший accessToken автоматически обновлялся.
export const getUser = async (): Promise<User> => {
  const result = await fetchWithRefresh<UserResponse>(USER_ENDPOINT, {
    headers: {
      authorization: getAccessToken() ?? '',
    },
  });
  return result.user;
};

// PATCH /auth/user — обновление данных пользователя.
export const updateUser = async (payload: UpdateUserPayload): Promise<User> => {
  const result = await fetchWithRefresh<UserResponse>(USER_ENDPOINT, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken() ?? '',
    },
    body: JSON.stringify(payload),
  });
  return result.user;
};
