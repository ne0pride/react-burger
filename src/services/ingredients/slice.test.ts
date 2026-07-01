import { describe, it, expect } from 'vitest';

import { mockBun, mockMain, mockSauce } from '@utils/test-mocks';

import { fetchIngredients } from './actions';
import {
  ingredientsSlice,
  selectIngredients,
  selectIsLoading,
  selectError,
} from './slice';

const { reducer } = ingredientsSlice;

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const items = [mockBun, mockMain, mockSauce];

describe('ingredients reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('fetchIngredients.pending включает загрузку и сбрасывает ошибку', () => {
    const state = reducer(
      { ...initialState, error: 'Старая ошибка' },
      { type: fetchIngredients.pending.type }
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled сохраняет ингредиенты и выключает загрузку', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      { type: fetchIngredients.fulfilled.type, payload: items }
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(items);
  });

  it('fetchIngredients.rejected сохраняет текст ошибки', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      { type: fetchIngredients.rejected.type, error: { message: 'Сеть недоступна' } }
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Сеть недоступна');
  });

  it('fetchIngredients.rejected подставляет текст по умолчанию', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      { type: fetchIngredients.rejected.type, error: {} }
    );

    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});

describe('ingredients selectors', () => {
  const rootWith = (overrides = {}) => ({
    ingredients: { ...initialState, ...overrides },
  });

  it('selectIngredients возвращает массив ингредиентов', () => {
    expect(selectIngredients(rootWith({ items }))).toEqual(items);
  });

  it('selectIsLoading возвращает флаг загрузки', () => {
    expect(selectIsLoading(rootWith({ isLoading: true }))).toBe(true);
  });

  it('selectError возвращает текст ошибки', () => {
    expect(selectError(rootWith({ error: 'Ошибка' }))).toBe('Ошибка');
  });
});
