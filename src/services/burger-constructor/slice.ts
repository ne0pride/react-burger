import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { ConstructorIngredient, Ingredient } from '@utils/types';

type BurgerConstructorState = {
  bun: ConstructorIngredient | null;
  ingredients: ConstructorIngredient[];
};

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<ConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: Ingredient) => {
        return {
          payload: {
            ...ingredient,
            uniqueId: nanoid(),
          },
        };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.uniqueId !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
  },
  selectors: {
    selectBun: (state) => state.bun,
    selectFillings: (state) => state.ingredients,

    // Мемоизированный селектор общей стоимости бургера.
    // Чек-лист: «Для подсчёта... общей стоимости используются
    // мемоизированные селекторы, которые описаны внутри слайса».
    //
    // createSelector принимает массив input-селекторов и output-функцию.
    // Если результаты input-селекторов не изменились (по ===),
    // output-функция НЕ вызывается, возвращается закэшированное значение.
    selectTotalPrice: createSelector(
      [
        (state: BurgerConstructorState) => state.bun,
        (state: BurgerConstructorState) => state.ingredients,
      ],
      (bun, ingredients) => {
        const bunPrice = bun ? bun.price * 2 : 0;
        const fillingsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
        return bunPrice + fillingsPrice;
      }
    ),

    // Мемоизированный селектор счётчиков ингредиентов.
    // Возвращает объект { [_id]: count }, где count — сколько раз
    // ингредиент использован в конструкторе.
    // Булка считается дважды (верх + низ).
    //
    // Чек-лист: «Для подсчёта количества добавленных в конструктор
    // ингредиентов... используются мемоизированные селекторы».
    selectIngredientCounts: createSelector(
      [
        (state: BurgerConstructorState) => state.bun,
        (state: BurgerConstructorState) => state.ingredients,
      ],
      (bun, ingredients) => {
        const counts: Record<string, number> = {};
        if (bun) {
          counts[bun._id] = 2;
        }
        ingredients.forEach((item) => {
          counts[item._id] = (counts[item._id] || 0) + 1;
        });
        return counts;
      }
    ),
  },
});

export const { addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;
export const { selectBun, selectFillings, selectTotalPrice, selectIngredientCounts } =
  burgerConstructorSlice.selectors;
