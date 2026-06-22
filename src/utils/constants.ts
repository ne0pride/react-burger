export const API_BASE_URL = 'https://new-stellarburgers.education-services.ru/api';

export const INGREDIENTS_ENDPOINT = `${API_BASE_URL}/ingredients`;
export const ORDERS_ENDPOINT = `${API_BASE_URL}/orders`;

// Auth endpoints
export const REGISTER_ENDPOINT = `${API_BASE_URL}/auth/register`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
export const LOGOUT_ENDPOINT = `${API_BASE_URL}/auth/logout`;
export const USER_ENDPOINT = `${API_BASE_URL}/auth/user`;
export const TOKEN_ENDPOINT = `${API_BASE_URL}/auth/token`;

// Password reset endpoints
export const PASSWORD_RESET_ENDPOINT = `${API_BASE_URL}/password-reset`;
export const PASSWORD_RESET_CONFIRM_ENDPOINT = `${API_BASE_URL}/password-reset/reset`;

// WebSocket endpoints (другой домен — без /api).
export const WS_BASE_URL = 'wss://new-stellarburgers.education-services.ru';
// Общая лента — без авторизации.
export const ORDERS_FEED_WS_URL = `${WS_BASE_URL}/orders/all`;
// Пользовательская лента — токен добавляется в query: ?token=${accessToken}
// (без префикса Bearer; см. profile-orders/middleware подключение).
export const ORDERS_USER_WS_URL = `${WS_BASE_URL}/orders`;
