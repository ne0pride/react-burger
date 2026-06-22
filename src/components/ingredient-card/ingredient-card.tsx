import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@services/hooks';
import { setIngredient } from '@services/ingredient-details/slice';

import type { Ingredient } from '@utils/types';

import styles from './ingredient-card.module.css';

type IngredientCardProps = {
  ingredient: Ingredient;
  count: number;
};

export const IngredientCard = ({ ingredient, count }: IngredientCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cardRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag<
    Ingredient,
    unknown,
    { isDragging: boolean }
  >({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(cardRef);

  const handleClick = () => {
    // Кладём ингредиент в стор (для рендера IngredientDetails внутри модалки).
    dispatch(setIngredient(ingredient));
    // Навигируем на /ingredients/:id, передавая текущий location как background.
    // Это магия паттерна "modal as a route": App увидит state.background
    // и нарисует модалку поверх текущего фона, а не отдельную страницу.
    navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location },
    });
  };

  const opacity = isDragging ? 0.4 : 1;

  return (
    <li ref={cardRef} className={styles.card} onClick={handleClick} style={{ opacity }}>
      <img src={ingredient.image} alt={ingredient.name} className={styles.image} />
      <div className={`${styles.price} mt-1 mb-1`}>
        <p className="text text_type_digits-default mr-2">{ingredient.price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
      {count > 0 && <Counter count={count} size="default" />}
    </li>
  );
};
