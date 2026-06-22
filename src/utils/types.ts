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
