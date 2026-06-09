import type { Ingredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  ingredient: Ingredient;
};

export const IngredientDetails = ({ ingredient }: IngredientDetailsProps) => {
  return (
    <div className={`${styles.details} pb-15`}>
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className={`${styles.image} mt-10`}
      />
      <p className={`${styles.name} text text_type_main-medium mt-4`}>
        {ingredient.name}
      </p>
      <ul className={`${styles.nutrition} mt-8`}>
        <li className={styles.nutrition_item}>
          <p className="text text_type_main-default text_color_inactive">Калории,ккал</p>
          <p className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.calories}
          </p>
        </li>
        <li className={styles.nutrition_item}>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <p className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.proteins}
          </p>
        </li>
        <li className={styles.nutrition_item}>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.fat}
          </p>
        </li>
        <li className={styles.nutrition_item}>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <p className="text text_type_digits-default text_color_inactive mt-2">
            {ingredient.carbohydrates}
          </p>
        </li>
      </ul>
    </div>
  );
};
