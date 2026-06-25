import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { authSlice } from './auth/slice';
import { burgerConstructorSlice } from './burger-constructor/slice';
import { feedSocketMiddleware } from './feed/middleware';
import { feedSlice } from './feed/slice';
import { ingredientDetailsSlice } from './ingredient-details/slice';
import { ingredientsSlice } from './ingredients/slice';
import { orderSlice } from './order/slice';
import { profileOrdersSocketMiddleware } from './profile-orders/middleware';
import { profileOrdersSlice } from './profile-orders/slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  ingredientDetailsSlice,
  burgerConstructorSlice,
  orderSlice,
  authSlice,
  feedSlice,
  profileOrdersSlice
);

export const store = configureStore({
  reducer: rootReducer,
  // Подключаем WS-middleware для лент заказов.
  // Каждый инстанс middleware ловит свои connect/disconnect-экшены и
  // управляет своим WebSocket-соединением, см. websocket-middleware.ts.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedSocketMiddleware, profileOrdersSocketMiddleware),
});

// Чек-лист: «Тип для хранилища описан на основе типа корневого редьюсера
// и ReturnType».
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
