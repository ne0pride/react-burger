import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';

import { ingredientPropType } from '@utils/prop-types';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient, count, onClick }) => {
  const handleClick = () => {
    onClick(ingredient);
  };

  return (
    <li className={styles.card} onClick={handleClick}>
      {count > 0 && <Counter count={count} size="default" />}
      <img
        src={ingredient.image}
        alt={ingredient.name}
        className={`${styles.image} ml-4 mr-4`}
      />
      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </li>
  );
};

IngredientCard.propTypes = {
  ingredient: ingredientPropType.isRequired,
  count: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

IngredientCard.defaultProps = {
  count: 0,
};
