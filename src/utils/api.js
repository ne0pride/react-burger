import { INGREDIENTS_ENDPOINT, ORDERS_ENDPOINT } from './constants';

// Универсальная обёртка проверки ответа.
// Если HTTP-статус не 2xx — бросаем ошибку.
// Если в теле {success: false} — бросаем ошибку с сообщением сервера.
const checkResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Запрос завершился с success: false');
  }
  return result;
};

// GET /ingredients — получить справочник ингредиентов.
export const getIngredients = async () => {
  const response = await fetch(INGREDIENTS_ENDPOINT);
  const result = await checkResponse(response);
  return result.data;
};

// POST /orders — создать заказ.
// Принимает массив _id ингредиентов (первый и последний — булка).
// Возвращает номер заказа.
export const createOrder = async (ingredientIds) => {
  const response = await fetch(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: ingredientIds }),
  });
  const result = await checkResponse(response);
  return result.order.number;
};
