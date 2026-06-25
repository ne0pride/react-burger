import { createSlice } from '@reduxjs/toolkit';

import {
  profileOrdersOnClose,
  profileOrdersOnError,
  profileOrdersOnMessage,
  profileOrdersOnOpen,
} from './actions';

import type { Order } from '@utils/types';

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

// Сообщение от сервера при истёкшем accessToken в WS-URL.
// По нему страница ProfileOrders сделает refreshToken + переподключение.
export const TOKEN_INVALID_MESSAGE = 'Invalid or missing token';

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileOrdersOnOpen, (state) => {
        state.status = 'open';
        state.error = null;
      })
      .addCase(profileOrdersOnClose, (state) => {
        state.status = 'closed';
      })
      .addCase(profileOrdersOnError, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })
      .addCase(profileOrdersOnMessage, (state, action) => {
        if (!action.payload.success) {
          // Ошибочный ответ сервера — типично "Invalid or missing token".
          // Страница увидит error и сделает refreshToken + переподключение.
          state.status = 'error';
          state.error = action.payload.message;
          return;
        }
        // Снапшот полностью заменяет ленту (требование ТЗ).
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      });
  },
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersTotal: (state) => state.total,
    selectProfileOrdersTotalToday: (state) => state.totalToday,
    selectProfileOrdersStatus: (state) => state.status,
    selectProfileOrdersError: (state) => state.error,
  },
});

export const {
  selectProfileOrders,
  selectProfileOrdersTotal,
  selectProfileOrdersTotalToday,
  selectProfileOrdersStatus,
  selectProfileOrdersError,
} = profileOrdersSlice.selectors;
