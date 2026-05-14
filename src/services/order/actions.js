import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrder } from '@utils/api';

// AsyncThunk для создания заказа.
// Принимает текущий состав бургера { bun, fillings },
// формирует массив _id (булка-начинки-булка) и вызывает API.
//
// Чек-лист: «Если используется подход с асинхронными экшенами,
// они должны быть размещены в отдельном файле, а не вместе со слайсом».
export const placeOrder = createAsyncThunk('order/place', async ({ bun, fillings }) => {
  // Формируем массив _id согласно требованию ТЗ:
  // «первый и последний элементы массива должны быть одинаковыми
  // и соответствовать идентификатору выбранной булки».
  const ingredientIds = [bun._id, ...fillings.map((item) => item._id), bun._id];
  return await createOrder(ingredientIds);
});
