import { createSlice } from '@reduxjs/toolkit';

import { placeOrder } from './actions';

const initialState = {
  // Номер успешно созданного заказа.
  // null = заказа нет (модалка должна быть закрыта).
  // число = есть заказ, показываем модалку.
  orderNumber: null,
  // true пока идёт запрос на создание заказа.
  isLoading: false,
  // Текст ошибки если запрос упал.
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Закрытие модалки заказа сбрасывает всё в initial.
    clearOrder: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderNumber = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось создать заказ';
      });
  },
  selectors: {
    selectOrderNumber: (state) => state.orderNumber,
    selectOrderIsLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error,
  },
});

export const { clearOrder } = orderSlice.actions;
export const { selectOrderNumber, selectOrderIsLoading, selectOrderError } =
  orderSlice.selectors;
