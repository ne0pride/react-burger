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
