import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // null = модалка с деталями закрыта
  // объект ингредиента = модалка открыта с этими данными
  ingredient: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  // Чек-лист: «Простой экшен описывает лишь одно действие».
  // Два экшена: «выбрать ингредиент» и «очистить».
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
