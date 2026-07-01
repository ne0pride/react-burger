import { describe, it, expect } from 'vitest';

import { mockMain } from '@utils/test-mocks';

import {
  ingredientDetailsSlice,
  setIngredient,
  clearIngredient,
  selectIngredientDetails,
} from './slice';

const { reducer } = ingredientDetailsSlice;

const initialState = {
  ingredient: null,
};

describe('ingredientDetails reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setIngredient записывает выбранный ингредиент', () => {
    const state = reducer(initialState, setIngredient(mockMain));

    expect(state.ingredient).toEqual(mockMain);
  });

  it('setIngredient заменяет ранее выбранный ингредиент', () => {
    const withFirst = reducer(initialState, setIngredient(mockMain));
    const other = { ...mockMain, _id: 'main-2', name: 'Биокотлета' };
    const state = reducer(withFirst, setIngredient(other));

    expect(state.ingredient).toEqual(other);
  });

  it('clearIngredient сбрасывает выбранный ингредиент', () => {
    const withCurrent = reducer(initialState, setIngredient(mockMain));
    const state = reducer(withCurrent, clearIngredient());

    expect(state.ingredient).toBeNull();
  });
});

describe('ingredientDetails selectors', () => {
  it('selectIngredientDetails возвращает текущий ингредиент', () => {
    expect(
      selectIngredientDetails({ ingredientDetails: { ingredient: mockMain } })
    ).toEqual(mockMain);
  });

  it('selectIngredientDetails возвращает null при отсутствии выбора', () => {
    expect(selectIngredientDetails({ ingredientDetails: initialState })).toBeNull();
  });
});
