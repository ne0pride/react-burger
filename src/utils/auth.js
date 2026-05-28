// Утилиты для работы с токенами в localStorage.
// Чек-лист: «Оба токена сохраняйте в localStorage».

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Флаг «пользователь запросил восстановление пароля» —
// нужен для защиты страницы /reset-password от прямых заходов.
// Чек-лист: «пользователь может попасть на страницу ResetPasswordPage,
// только если он перед этим побывал на странице ForgotPasswordPage
// и получил код по email. Для этого используйте флаг в локальном хранилище».
const PASSWORD_RESET_REQUESTED_KEY = 'passwordResetRequested';

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setPasswordResetRequested = () => {
  localStorage.setItem(PASSWORD_RESET_REQUESTED_KEY, 'true');
};

export const isPasswordResetRequested = () => {
  return localStorage.getItem(PASSWORD_RESET_REQUESTED_KEY) === 'true';
};

export const clearPasswordResetRequested = () => {
  localStorage.removeItem(PASSWORD_RESET_REQUESTED_KEY);
};
