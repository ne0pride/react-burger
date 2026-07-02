import { describe, it, expect } from 'vitest';

import { mockFeedResponse } from '@utils/test-mocks';

import {
  profileOrdersOnClose,
  profileOrdersOnError,
  profileOrdersOnMessage,
  profileOrdersOnOpen,
} from './actions';
import {
  profileOrdersSlice,
  selectProfileOrders,
  selectProfileOrdersTotal,
  selectProfileOrdersTotalToday,
  selectProfileOrdersStatus,
  selectProfileOrdersError,
} from './slice';

import type { Order } from '@utils/types';

const { reducer } = profileOrdersSlice;

type ProfileOrdersStatus = 'idle' | 'open' | 'closed' | 'error';
type ProfileOrdersState = {
  orders: Order[];
  total: number;
  totalToday: number;
  status: ProfileOrdersStatus;
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null,
};

describe('profileOrders reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('profileOrdersOnOpen переводит статус в open и сбрасывает ошибку', () => {
    const state = reducer({ ...initialState, error: 'x' }, profileOrdersOnOpen());
    expect(state.status).toBe('open');
    expect(state.error).toBeNull();
  });

  it('profileOrdersOnClose переводит статус в closed', () => {
    const state = reducer({ ...initialState, status: 'open' }, profileOrdersOnClose());
    expect(state.status).toBe('closed');
  });

  it('profileOrdersOnError переводит в error и сохраняет текст', () => {
    const state = reducer(
      initialState,
      profileOrdersOnError('Invalid or missing token')
    );
    expect(state.status).toBe('error');
    expect(state.error).toBe('Invalid or missing token');
  });

  it('profileOrdersOnMessage заменяет ленту и счётчики при success', () => {
    const state = reducer(initialState, profileOrdersOnMessage(mockFeedResponse));

    expect(state.orders).toEqual(mockFeedResponse.orders);
    expect(state.total).toBe(1234);
    expect(state.totalToday).toBe(56);
    expect(state.error).toBeNull();
  });

  it('profileOrdersOnMessage с success: false пишет ошибку', () => {
    const state = reducer(
      initialState,
      profileOrdersOnMessage({ success: false, message: 'Invalid or missing token' })
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Invalid or missing token');
  });
});

describe('profileOrders selectors', () => {
  const rootWith = (overrides: Partial<ProfileOrdersState> = {}) => ({
    profileOrders: { ...initialState, ...overrides },
  });

  it('selectProfileOrders возвращает заказы', () => {
    expect(selectProfileOrders(rootWith({ orders: mockFeedResponse.orders }))).toEqual(
      mockFeedResponse.orders
    );
  });

  it('selectProfileOrdersTotal и ...TotalToday возвращают счётчики', () => {
    const root = rootWith({ total: 1234, totalToday: 56 });
    expect(selectProfileOrdersTotal(root)).toBe(1234);
    expect(selectProfileOrdersTotalToday(root)).toBe(56);
  });

  it('selectProfileOrdersStatus и ...Error возвращают статус и ошибку', () => {
    const root = rootWith({ status: 'error', error: 'Ошибка' });
    expect(selectProfileOrdersStatus(root)).toBe('error');
    expect(selectProfileOrdersError(root)).toBe('Ошибка');
  });
});
