import { createSlice } from '@reduxjs/toolkit';

import { feedOnClose, feedOnError, feedOnMessage, feedOnOpen } from './actions';

import type { Order } from '@utils/types';

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

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedOnOpen, (state) => {
        state.status = 'open';
        state.error = null;
      })
      .addCase(feedOnClose, (state) => {
        state.status = 'closed';
      })
      .addCase(feedOnError, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(feedOnMessage, (state, action) => {
        // Сервер изредка может прислать ошибку через тот же канал
        // (success: false с полем message). Дискриминируем по success.
        if (!action.payload.success) {
          state.status = 'error';
          state.error = action.payload.message;
          return;
        }
        // ТЗ спринта 5: «актуализировать всю ленту заказов при каждом
        // обновлении списка заказов на сервере» — полностью заменяем,
        // а не мерджим (явно допустимое решение по описанию).
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedStatus: (state) => state.status,
    selectFeedError: (state) => state.error,
  },
});

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedStatus,
  selectFeedError,
} = feedSlice.selectors;
