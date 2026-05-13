import { INGREDIENTS_ENDPOINT } from './constants';

// Универсальная проверка ответа от сервера.
// Если статус НЕ ok (200–299) — выбрасываем ошибку, чтобы её поймал .catch()
const checkResponse = (response) => {
  if (!response.ok) {
    return Promise.reject(`Ошибка ${response.status}`);
  }
  return response.json();
};

// Запрос за списком ингредиентов.
// Сервер возвращает объект вида { success: true, data: [...] }
export const getIngredients = () => {
  return fetch(INGREDIENTS_ENDPOINT)
    .then(checkResponse)
    .then((result) => {
      if (!result.success) {
        return Promise.reject('Ответ сервера не success');
      }
      return result.data;
    });
};
