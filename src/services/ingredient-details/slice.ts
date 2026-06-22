import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient } from '@utils/types';

type IngredientDetailsState = {
  ingredient: Ingredient | null;
};

const initialState: IngredientDetailsState = {
  ingredient: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.ingredient = action.payload;
    },
    clearIngredient: (state) => {
      state.ingredient = null;
    },
  },
  selectors: {
    selectIngredientDetails: (state) => state.ingredient,
  },
});

export const { setIngredient, clearIngredient } = ingredientDetailsSlice.actions;
export const { selectIngredientDetails } = ingredientDetailsSlice.selectors;
