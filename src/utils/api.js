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

const checkResponse = async (response) => {
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
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Запрос завершился с success: false');
  }
  return result;
};

// Обновление пары токенов по refreshToken.
// POST /auth/token { token: refreshToken } -> новые accessToken/refreshToken.
// Сразу сохраняем их в localStorage.
export const refreshToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: getRefreshToken() }),
  });
  const result = await checkResponse(response);
  setTokens({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
  return result;
};

// Обёртка над fetch для запросов, требующих авторизации.
// accessToken живёт 20 минут: если он истёк, сервер вернёт ошибку
// «jwt expired». Тогда обновляем токен и повторяем исходный запрос
// уже с новым accessToken. Прочие ошибки пробрасываем наверх.
export const fetchWithRefresh = async (url, options) => {
  try {
    const response = await fetch(url, options);
    return await checkResponse(response);
  } catch (err) {
    if (err.message === 'jwt expired') {
      const refreshData = await refreshToken();
      options.headers.authorization = refreshData.accessToken;
      const response = await fetch(url, options);
      return await checkResponse(response);
    }
    return Promise.reject(err);
  }
};

export const getIngredients = async () => {
  const response = await fetch(INGREDIENTS_ENDPOINT);
  const result = await checkResponse(response);
  return result.data;
};

export const createOrder = async (ingredientIds) => {
  // Создание заказа требует авторизации — передаём accessToken
  // и пропускаем запрос через fetchWithRefresh (обновит токен при истечении).
  const result = await fetchWithRefresh(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken(),
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });
  return result.order.number;
};

export const registerUser = async ({ email, password, name }) => {
  const response = await fetch(REGISTER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  const result = await checkResponse(response);
  return {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result = await checkResponse(response);
  return {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  };
};

export const logoutUser = async (refreshToken) => {
  const response = await fetch(LOGOUT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  });
  await checkResponse(response);
};

export const requestPasswordReset = async (email) => {
  const response = await fetch(PASSWORD_RESET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  await checkResponse(response);
};

export const confirmPasswordReset = async ({ password, token }) => {
  const response = await fetch(PASSWORD_RESET_CONFIRM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token }),
  });
  await checkResponse(response);
};

// GET /auth/user — данные текущего пользователя.
// Чек-лист: «При получении и обновлении информации о пользователе серверу
// передаётся токен в поле authorization». Через fetchWithRefresh, чтобы
// на старте приложения протухший accessToken автоматически обновлялся.
export const getUser = async () => {
  const result = await fetchWithRefresh(USER_ENDPOINT, {
    headers: {
      authorization: getAccessToken(),
    },
  });
  return result.user;
};

// PATCH /auth/user — обновление данных пользователя.
export const updateUser = async ({ name, email, password }) => {
  const result = await fetchWithRefresh(USER_ENDPOINT, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: getAccessToken(),
    },
    body: JSON.stringify({ name, email, password }),
  });
  return result.user;
};
