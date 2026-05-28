import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить ингредиенты';
      });
  },
  selectors: {
    selectIngredients: (state) => state.items,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
  },
});

export const { selectIngredients, selectIsLoading, selectError } =
  ingredientsSlice.selectors;
