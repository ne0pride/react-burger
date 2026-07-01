import { describe, it, expect } from 'vitest';

import { mockUser } from '@utils/test-mocks';

import { checkAuth, login, logout, register, updateProfile } from './actions';
import {
  authSlice,
  setAuthChecked,
  clearAuthError,
  selectUser,
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectAuthLoading,
  selectAuthError,
} from './slice';

const { reducer } = authSlice;

const initialState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

const rejectedWith = (message: string) => ({ error: { message } });

describe('auth reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('обычные редьюсеры', () => {
    it('setAuthChecked выставляет флаг проверки авторизации', () => {
      const state = reducer(initialState, setAuthChecked(true));
      expect(state.isAuthChecked).toBe(true);
    });

    it('clearAuthError сбрасывает ошибку', () => {
      const state = reducer({ ...initialState, error: 'Ошибка' }, clearAuthError());
      expect(state.error).toBeNull();
    });
  });

  describe('register', () => {
    it('pending включает загрузку и сбрасывает ошибку', () => {
      const state = reducer(
        { ...initialState, error: 'x' },
        { type: register.pending.type }
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя и отмечает проверку', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        { type: register.fulfilled.type, payload: mockUser }
      );
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected сохраняет текст ошибки', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        { type: register.rejected.type, ...rejectedWith('Ошибка регистрации') }
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('login', () => {
    it('pending включает загрузку и сбрасывает ошибку', () => {
      const state = reducer(
        { ...initialState, error: 'x' },
        { type: login.pending.type }
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя', () => {
      const state = reducer(initialState, {
        type: login.fulfilled.type,
        payload: mockUser,
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected сохраняет текст ошибки', () => {
      const state = reducer(initialState, {
        type: login.rejected.type,
        ...rejectedWith('Ошибка авторизации'),
      });
      expect(state.error).toBe('Ошибка авторизации');
    });
  });

  describe('logout', () => {
    it('fulfilled очищает пользователя', () => {
      const state = reducer(
        { ...initialState, user: mockUser },
        { type: logout.fulfilled.type }
      );
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected всё равно очищает пользователя и пишет ошибку', () => {
      const state = reducer(
        { ...initialState, user: mockUser },
        { type: logout.rejected.type, ...rejectedWith('Ошибка выхода') }
      );
      expect(state.user).toBeNull();
      expect(state.error).toBe('Ошибка выхода');
    });
  });

  describe('checkAuth', () => {
    it('fulfilled сохраняет пользователя и отмечает проверку', () => {
      const state = reducer(initialState, {
        type: checkAuth.fulfilled.type,
        payload: mockUser,
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('rejected очищает пользователя, но отмечает проверку', () => {
      const state = reducer(
        { ...initialState, user: mockUser },
        { type: checkAuth.rejected.type, ...rejectedWith('нет токена') }
      );
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateProfile', () => {
    it('fulfilled обновляет пользователя', () => {
      const updated = { ...mockUser, name: 'Новое имя' };
      const state = reducer(
        { ...initialState, user: mockUser },
        { type: updateProfile.fulfilled.type, payload: updated }
      );
      expect(state.user).toEqual(updated);
    });

    it('rejected сохраняет текст ошибки', () => {
      const state = reducer(initialState, {
        type: updateProfile.rejected.type,
        ...rejectedWith('Ошибка обновления профиля'),
      });
      expect(state.error).toBe('Ошибка обновления профиля');
    });
  });
});

describe('auth selectors', () => {
  const rootWith = (overrides = {}) => ({ auth: { ...initialState, ...overrides } });

  it('selectUser возвращает пользователя', () => {
    expect(selectUser(rootWith({ user: mockUser }))).toEqual(mockUser);
  });

  it('selectIsAuthenticated истинно при наличии пользователя', () => {
    expect(selectIsAuthenticated(rootWith({ user: mockUser }))).toBe(true);
    expect(selectIsAuthenticated(rootWith())).toBe(false);
  });

  it('selectIsAuthChecked возвращает флаг проверки', () => {
    expect(selectIsAuthChecked(rootWith({ isAuthChecked: true }))).toBe(true);
  });

  it('selectAuthLoading возвращает флаг загрузки', () => {
    expect(selectAuthLoading(rootWith({ isLoading: true }))).toBe(true);
  });

  it('selectAuthError возвращает текст ошибки', () => {
    expect(selectAuthError(rootWith({ error: 'Ошибка' }))).toBe('Ошибка');
  });
});
