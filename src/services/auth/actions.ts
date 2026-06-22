import { createAsyncThunk } from '@reduxjs/toolkit';

import { getUser, loginUser, logoutUser, registerUser, updateUser } from '@utils/api';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@utils/auth';

import type {
  LoginPayload,
  RegisterPayload,
  UpdateUserPayload,
  User,
} from '@utils/types';

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload) => {
    const data = await registerUser(payload);
    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return data.user;
  }
);

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload) => {
  const data = await loginUser(payload);
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

export const checkAuth = createAsyncThunk<User | null>('auth/checkAuth', async () => {
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
  async (payload: UpdateUserPayload) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('Не авторизован');
    }
    return await updateUser(payload);
  }
);
