import { describe, it, expect } from 'vitest';

import {
  asConstructorIngredient,
  mockBun,
  mockMain,
  mockSauce,
} from '@utils/test-mocks';

import {
  burgerConstructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient,
  selectBun,
  selectFillings,
  selectTotalPrice,
  selectIngredientCounts,
} from './slice';

import type { ConstructorIngredient } from '@utils/types';

const { reducer } = burgerConstructorSlice;

type ConstructorState = {
  bun: ConstructorIngredient | null;
  ingredients: ConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
};

// Обёртка для проверки экспортируемых селекторов, которые ждут корневой стейт.
const rootWith = (state: ConstructorState) => ({
  burgerConstructor: state,
});

describe('burgerConstructor reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('устанавливает булку в поле bun и добавляет uniqueId', () => {
      const state = reducer(initialState, addIngredient(mockBun));

      expect(state.bun).toMatchObject(mockBun);
      expect(state.bun?.uniqueId).toEqual(expect.any(String));
      expect(state.ingredients).toHaveLength(0);
    });

    it('заменяет булку при добавлении новой', () => {
      const withBun = reducer(initialState, addIngredient(mockBun));
      const otherBun = { ...mockBun, _id: 'bun-2', name: 'Флюоресцентная булка' };
      const state = reducer(withBun, addIngredient(otherBun));

      expect(state.bun).toMatchObject(otherBun);
    });

    it('добавляет начинку в массив ingredients', () => {
      const state = reducer(initialState, addIngredient(mockMain));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject(mockMain);
      expect(state.ingredients[0].uniqueId).toEqual(expect.any(String));
    });

    it('сохраняет порядок нескольких начинок', () => {
      let state = reducer(initialState, addIngredient(mockMain));
      state = reducer(state, addIngredient(mockSauce));

      expect(state.ingredients.map((item) => item._id)).toEqual(['main-1', 'sauce-1']);
    });

    it('присваивает уникальный uniqueId каждой начинке', () => {
      let state = reducer(initialState, addIngredient(mockMain));
      state = reducer(state, addIngredient(mockMain));

      expect(state.ingredients[0].uniqueId).not.toEqual(state.ingredients[1].uniqueId);
    });
  });

  describe('removeIngredient', () => {
    it('удаляет начинку по uniqueId', () => {
      let state = reducer(initialState, addIngredient(mockMain));
      state = reducer(state, addIngredient(mockSauce));
      const targetId = state.ingredients[0].uniqueId;

      state = reducer(state, removeIngredient(targetId));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('sauce-1');
    });

    it('не меняет состояние при несуществующем uniqueId', () => {
      const withMain = reducer(initialState, addIngredient(mockMain));
      const state = reducer(withMain, removeIngredient('unknown'));

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    const buildState = () => {
      const ingredients: ConstructorIngredient[] = [
        asConstructorIngredient({ ...mockMain, _id: 'a' }, 'ua'),
        asConstructorIngredient({ ...mockMain, _id: 'b' }, 'ub'),
        asConstructorIngredient({ ...mockMain, _id: 'c' }, 'uc'),
      ];
      return { bun: null, ingredients };
    };

    it('перемещает начинку с одной позиции на другую', () => {
      const state = reducer(buildState(), moveIngredient({ fromIndex: 0, toIndex: 2 }));

      expect(state.ingredients.map((item) => item._id)).toEqual(['b', 'c', 'a']);
    });

    it('не меняет порядок при равных индексах', () => {
      const state = reducer(buildState(), moveIngredient({ fromIndex: 1, toIndex: 1 }));

      expect(state.ingredients.map((item) => item._id)).toEqual(['a', 'b', 'c']);
    });
  });
});

describe('burgerConstructor selectors', () => {
  const buildFilledState = () => ({
    bun: asConstructorIngredient(mockBun, 'ubun'),
    ingredients: [
      asConstructorIngredient(mockMain, 'um'),
      asConstructorIngredient(mockSauce, 'us'),
    ],
  });

  it('selectBun и selectFillings возвращают части конструктора', () => {
    const root = rootWith(buildFilledState());
    expect(selectBun(root)?._id).toBe('bun-1');
    expect(selectFillings(root).map((item) => item._id)).toEqual(['main-1', 'sauce-1']);
  });

  it('selectTotalPrice учитывает булку дважды и начинки', () => {
    // 1255 * 2 + 3000 + 90
    expect(selectTotalPrice(rootWith(buildFilledState()))).toBe(1255 * 2 + 3000 + 90);
  });

  it('selectTotalPrice возвращает 0 для пустого конструктора', () => {
    expect(selectTotalPrice(rootWith(initialState))).toBe(0);
  });

  it('selectIngredientCounts считает булку как 2, начинки по количеству', () => {
    const counts = selectIngredientCounts(rootWith(buildFilledState()));

    expect(counts['bun-1']).toBe(2);
    expect(counts['main-1']).toBe(1);
    expect(counts['sauce-1']).toBe(1);
  });
});
