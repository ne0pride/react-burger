import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { ingredientPropType } from '@utils/prop-types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients, onOrderClick }) => {
  // Выбираем булку (первую попавшуюся) и начинки (всё, кроме булок).
  // На следующем спринте это будет приходить из стейта конструктора (Redux).
  const bun = useMemo(
    () => ingredients.find((item) => item.type === 'bun'),
    [ingredients]
  );

  const fillings = useMemo(
    () => ingredients.filter((item) => item.type !== 'bun'),
    [ingredients]
  );

  // Итоговая цена: 2 булки (верх + низ) + все начинки.
  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingsPrice = fillings.reduce((sum, item) => sum + item.price, 0);
    return bunPrice + fillingsPrice;
  }, [bun, fillings]);

  if (!bun) {
    return null;
  }

  return (
    <section className={styles.burger_constructor}>
      <div className={styles.bun}>
        <ConstructorElement
          type="top"
          isLocked={true}
          text={`${bun.name} (верх)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      </div>

      <ul className={`${styles.fillings} custom-scroll`}>
        {fillings.map((ingredient, index) => (
          <li key={`${ingredient._id}-${index}`} className={styles.filling_item}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
            />
          </li>
        ))}
      </ul>

      <div className={styles.bun}>
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={`${bun.name} (низ)`}
          price={bun.price}
          thumbnail={bun.image}
        />
      </div>

      <div className={styles.total}>
        <div className={styles.total_price}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
  onOrderClick: PropTypes.func.isRequired,
};
