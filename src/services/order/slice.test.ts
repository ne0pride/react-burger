import { describe, it, expect } from 'vitest';

import { placeOrder } from './actions';
import {
  orderSlice,
  clearOrder,
  selectOrderNumber,
  selectOrderIsLoading,
  selectOrderError,
} from './slice';

const { reducer } = orderSlice;

const initialState = {
  orderNumber: null,
  isLoading: false,
  error: null,
};

describe('order reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('placeOrder.pending включает загрузку и сбрасывает ошибку', () => {
    const state = reducer(
      { ...initialState, error: 'Старая ошибка' },
      { type: placeOrder.pending.type }
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('placeOrder.fulfilled сохраняет номер заказа', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      { type: placeOrder.fulfilled.type, payload: 78901 }
    );

    expect(state.isLoading).toBe(false);
    expect(state.orderNumber).toBe(78901);
  });

  it('placeOrder.rejected сохраняет текст ошибки', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      { type: placeOrder.rejected.type, error: { message: 'Заказ не прошёл' } }
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Заказ не прошёл');
  });

  it('placeOrder.rejected подставляет текст по умолчанию', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      { type: placeOrder.rejected.type, error: {} }
    );

    expect(state.error).toBe('Не удалось создать заказ');
  });

  it('clearOrder сбрасывает состояние к начальному', () => {
    const filled = { orderNumber: 78901, isLoading: false, error: null };

    expect(reducer(filled, clearOrder())).toEqual(initialState);
  });
});

describe('order selectors', () => {
  const rootWith = (overrides = {}) => ({ order: { ...initialState, ...overrides } });

  it('selectOrderNumber возвращает номер заказа', () => {
    expect(selectOrderNumber(rootWith({ orderNumber: 78901 }))).toBe(78901);
  });

  it('selectOrderIsLoading возвращает флаг загрузки', () => {
    expect(selectOrderIsLoading(rootWith({ isLoading: true }))).toBe(true);
  });

  it('selectOrderError возвращает текст ошибки', () => {
    expect(selectOrderError(rootWith({ error: 'Ошибка' }))).toBe('Ошибка');
  });
});
