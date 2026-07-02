import { describe, it, expect } from 'vitest';

import { mockFeedResponse } from '@utils/test-mocks';

import { feedOnClose, feedOnError, feedOnMessage, feedOnOpen } from './actions';
import {
  feedSlice,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedStatus,
  selectFeedError,
} from './slice';

import type { Order } from '@utils/types';

const { reducer } = feedSlice;

type FeedStatus = 'idle' | 'open' | 'closed' | 'error';
type FeedState = {
  orders: Order[];
  total: number;
  totalToday: number;
  status: FeedStatus;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: null,
};

describe('feed reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('feedOnOpen переводит статус в open и сбрасывает ошибку', () => {
    const state = reducer({ ...initialState, error: 'x' }, feedOnOpen());
    expect(state.status).toBe('open');
    expect(state.error).toBeNull();
  });

  it('feedOnClose переводит статус в closed', () => {
    const state = reducer({ ...initialState, status: 'open' }, feedOnClose());
    expect(state.status).toBe('closed');
  });

  it('feedOnError переводит в error и сохраняет текст', () => {
    const state = reducer(initialState, feedOnError('Разрыв соединения'));
    expect(state.status).toBe('error');
    expect(state.error).toBe('Разрыв соединения');
  });

  it('feedOnMessage заменяет ленту и счётчики при success', () => {
    const state = reducer(initialState, feedOnMessage(mockFeedResponse));

    expect(state.orders).toEqual(mockFeedResponse.orders);
    expect(state.total).toBe(1234);
    expect(state.totalToday).toBe(56);
    expect(state.error).toBeNull();
  });

  it('feedOnMessage с success: false пишет ошибку', () => {
    const state = reducer(
      initialState,
      feedOnMessage({ success: false, message: 'Ошибка сервера' })
    );

    expect(state.status).toBe('error');
    expect(state.error).toBe('Ошибка сервера');
  });
});

describe('feed selectors', () => {
  const rootWith = (overrides: Partial<FeedState> = {}) => ({
    feed: { ...initialState, ...overrides },
  });

  it('selectFeedOrders возвращает заказы', () => {
    expect(selectFeedOrders(rootWith({ orders: mockFeedResponse.orders }))).toEqual(
      mockFeedResponse.orders
    );
  });

  it('selectFeedTotal и selectFeedTotalToday возвращают счётчики', () => {
    const root = rootWith({ total: 1234, totalToday: 56 });
    expect(selectFeedTotal(root)).toBe(1234);
    expect(selectFeedTotalToday(root)).toBe(56);
  });

  it('selectFeedStatus и selectFeedError возвращают статус и ошибку', () => {
    const root = rootWith({ status: 'error', error: 'Ошибка' });
    expect(selectFeedStatus(root)).toBe('error');
    expect(selectFeedError(root)).toBe('Ошибка');
  });
});
