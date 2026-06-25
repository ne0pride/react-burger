// Общие доменные типы и формы API-ответов.
// Сюда выносим только то, что переиспользуется в нескольких местах.
// Внутренние типы стейта слайсов — рядом с самими слайсами.

// === Домен ===

export type IngredientType = 'bun' | 'main' | 'sauce';

export type Ingredient = {
  _id: string;
  name: string;
  type: IngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
};

// Ингредиент в конструкторе бургера: оригинал + uniqueId, который
// генерируется nanoid при добавлении, чтобы различать дубликаты при удалении.
export type ConstructorIngredient = {
  uniqueId: string;
} & Ingredient;

export type User = {
  email: string;
  name: string;
};

// === Заказы (лента и история) ===

export type OrderStatus = 'created' | 'pending' | 'done';

// Заказ в том виде, как приходит по WebSocket и из GET /api/orders/{number}.
// Поле ingredients — массив _id ингредиентов; стоимость считаем сами
// по загруженному списку ингредиентов.
export type Order = {
  _id: string;
  ingredients: string[];
  status: OrderStatus;
  number: number;
  name?: string;
  createdAt: string;
  updatedAt: string;
};

// === Payload'ы для запросов ===

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UpdateUserPayload = {
  name: string;
  email: string;
  password: string;
};

export type ConfirmPasswordResetPayload = {
  password: string;
  token: string;
};

// === Ответы сервера ===
// Каждый ответ содержит флаг success (его проверяет checkResponse и бросает,
// если false). Прочие поля специфичны для эндпоинта.

export type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

export type OrderResponse = {
  success: boolean;
  name: string;
  order: { number: number };
};

export type AuthResponse = {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
};

// AuthResponse без поля success — то, что отдают функции registerUser/loginUser
// после снятия «технического» success.
export type AuthData = Omit<AuthResponse, 'success'>;

export type TokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

// Успешное сообщение WebSocket'а лент заказов (/orders/all и /orders?token=).
// Сервер шлёт это при каждом обновлении: полный снапшот последних
// (макс. 50) заказов + счётчики.
export type OrdersFeedResponse = {
  success: true;
  orders: Order[];
  total: number;
  totalToday: number;
};

// Ошибка WebSocket-сообщения от сервера. Самый частый случай —
// «Invalid or missing token» в пользовательской ленте при истёкшем accessToken.
// Сервер шлёт это поверх того же канала, поэтому слайс должен уметь
// различать успех/ошибку через дискриминатор success.
export type WsErrorResponse = {
  success: false;
  message: string;
};

// Дискриминированное объединение того, что приходит по WS. Используется
// как payload в onMessage обоих middleware (feed и profileOrders).
export type OrdersFeedMessage = OrdersFeedResponse | WsErrorResponse;

// Ответ GET /api/orders/{number} — fallback для случая, когда заказ
// с таким номером отсутствует в WS-снапшоте (сервер шлёт max 50 последних).
export type OrderByNumberResponse = {
  success: boolean;
  orders: Order[];
};
