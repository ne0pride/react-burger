import { createSlice } from '@reduxjs/toolkit';

import { checkAuth, login, logout, register, updateProfile } from './actions';

const initialState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    // Сброс ошибки — нужен, чтобы старая ошибка login не висела на странице
    // профиля. Вызываем при размонтировании страниц-форм.
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === REGISTER ===
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // === LOGIN ===
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка авторизации';
      })

      // === LOGOUT ===
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка выхода';
      })

      // === CHECK AUTH ===
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })

      // === UPDATE PROFILE ===
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления профиля';
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.user !== null,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectAuthLoading: (state) => state.isLoading,
    selectAuthError: (state) => state.error,
  },
});

export const { setAuthChecked, clearAuthError } = authSlice.actions;
export const {
  selectUser,
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectAuthLoading,
  selectAuthError,
} = authSlice.selectors;
