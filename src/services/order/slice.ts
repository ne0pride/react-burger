import { createSlice } from '@reduxjs/toolkit';

import { placeOrder } from './actions';

type OrderState = {
  orderNumber: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderNumber: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
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
