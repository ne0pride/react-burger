// Общие мок-данные для тестов редьюсеров.
// Вынесены отдельно, чтобы не дублировать фикстуры в каждом slice.test.ts.

import type {
  ConstructorIngredient,
  Ingredient,
  Order,
  OrdersFeedResponse,
  User,
} from './types';

export const mockBun: Ingredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png',
};

export const mockMain: Ingredient = {
  _id: 'main-1',
  name: 'Говяжий метеорит',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'main.png',
  image_mobile: 'main-mobile.png',
  image_large: 'main-large.png',
};

export const mockSauce: Ingredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_mobile: 'sauce-mobile.png',
  image_large: 'sauce-large.png',
};

// Ингредиент в конструкторе = оригинал + uniqueId.
export const asConstructorIngredient = (
  ingredient: Ingredient,
  uniqueId: string
): ConstructorIngredient => ({ ...ingredient, uniqueId });

export const mockUser: User = {
  email: 'test@example.com',
  name: 'Tester',
};

export const mockOrder: Order = {
  _id: 'order-1',
  ingredients: ['bun-1', 'main-1', 'bun-1'],
  status: 'done',
  number: 78901,
  name: 'Космический бургер',
  createdAt: '2024-07-26T12:00:00.000Z',
  updatedAt: '2024-07-26T12:00:00.000Z',
};

export const mockFeedResponse: OrdersFeedResponse = {
  success: true,
  orders: [mockOrder],
  total: 1234,
  totalToday: 56,
};
