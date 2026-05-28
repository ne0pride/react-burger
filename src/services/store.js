import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth/slice';
import { burgerConstructorSlice } from './burger-constructor/slice';
import { ingredientDetailsSlice } from './ingredient-details/slice';
import { ingredientsSlice } from './ingredients/slice';
import { orderSlice } from './order/slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  ingredientDetailsSlice,
  burgerConstructorSlice,
  orderSlice,
  authSlice
);

export const store = configureStore({
  reducer: rootReducer,
});
