import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ingredient: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,

  reducers: {
    setIngredient: (state, action) => {
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
