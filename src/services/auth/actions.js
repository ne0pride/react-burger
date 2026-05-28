import { createAsyncThunk } from '@reduxjs/toolkit';

import { getUser, loginUser, logoutUser, registerUser, updateUser } from '@utils/api';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@utils/auth';

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }) => {
    const data = await registerUser({ email, password, name });
    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return data.user;
  }
);

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const data = await loginUser({ email, password });
  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return data.user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await logoutUser(refreshToken);
  }
  clearTokens();
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return null;
  }
  try {
    // getUser сам обновит протухший accessToken через fetchWithRefresh.
    const user = await getUser();
    return user;
  } catch (err) {
    clearTokens();
    throw err;
  }
});

// Обновление данных профиля.
// Принимает поля формы { name, email, password }, отправляет PATCH /auth/user
// с текущим accessToken, возвращает обновлённый объект user.
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, email, password }) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('Не авторизован');
    }
    return await updateUser({ name, email, password });
  }
);
