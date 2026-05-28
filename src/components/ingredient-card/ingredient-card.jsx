import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { setIngredient } from '@services/ingredient-details/slice';
import { ingredientPropType } from '@utils/prop-types';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient, count }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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
    <li ref={dragRef} className={styles.card} onClick={handleClick} style={{ opacity }}>
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

IngredientCard.propTypes = {
  ingredient: ingredientPropType.isRequired,
  count: PropTypes.number.isRequired,
};
