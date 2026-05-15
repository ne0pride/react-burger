import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions';

const initialState = {
  // Массив ингредиентов с сервера.
  items: [],
  // true пока идёт запрос за ингредиентами.
  isLoading: false,
  // Текст ошибки, если запрос упал. null если ошибки нет.
  error: null,
};

export const ingredientsSlice = createSlice({
  // Имя слайса — будет ключом в корневом state.
  // То есть state.ingredients.items и т.д.
  name: 'ingredients',
  initialState,
  reducers: {},
  // extraReducers обрабатывают экшены, которые приходят извне —
  // в нашем случае от asyncThunk'а fetchIngredients.
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
  // Чек-лист: «Селекторы описаны внутри слайсов».
  // Селекторы получают state ВСЕГО стора и возвращают нужный кусок.
  // Используются в компонентах через useSelector(selectIngredients).
  selectors: {
    selectIngredients: (state) => state.items,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
  },
});

// Экспортируем селекторы для использования в компонентах.
export const { selectIngredients, selectIsLoading, selectError } =
  ingredientsSlice.selectors;
