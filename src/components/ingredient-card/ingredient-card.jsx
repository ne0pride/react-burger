import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';

import { ingredientPropType } from '@utils/prop-types';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient, count, onClick }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    onClick(ingredient);
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
  onClick: PropTypes.func.isRequired,
};
