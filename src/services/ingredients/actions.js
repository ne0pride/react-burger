import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredients } from '@utils/api';

// Асинхронный экшен загрузки ингредиентов с сервера.
// Чек-лист требует, чтобы asyncThunk'и жили отдельно от слайсов.
//
// Первый аргумент — type-префикс действия. Из него createAsyncThunk
// автоматически генерирует три экшена:
//   - ingredients/fetchAll/pending
//   - ingredients/fetchAll/fulfilled
//   - ingredients/fetchAll/rejected
// которые слайс ловит в extraReducers.
//
// Второй аргумент — функция payload creator. Она возвращает промис.
// Если промис зарезолвится — экшен будет fulfilled с этим значением как payload.
// Если зареджектится — экшен будет rejected, ошибка попадёт в action.error.
export const fetchIngredients = createAsyncThunk('ingredients/fetchAll', async () => {
  // getIngredients уже бросает Error при неуспехе response.ok или success: false,
  // поэтому здесь дополнительная проверка не нужна — её обработает rejected-кейс.
  return await getIngredients();
});
