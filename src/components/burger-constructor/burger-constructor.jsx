import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { BurgerConstructorItem } from '@components/burger-constructor-item/burger-constructor-item';
import {
  addIngredient,
  moveIngredient,
  removeIngredient,
  selectBun,
  selectFillings,
  selectTotalPrice,
} from '@services/burger-constructor/slice';
import { placeOrder } from '@services/order/actions';
import { selectOrderIsLoading } from '@services/order/slice';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();

  const bun = useSelector(selectBun);
  const fillings = useSelector(selectFillings);
  const totalPrice = useSelector(selectTotalPrice);
  const isOrderLoading = useSelector(selectOrderIsLoading);

  const [{ isOver, draggedItem }, dropRef] = useDrop({
    accept: 'ingredient',
    drop: (item) => {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem(),
    }),
  });

  const handleRemove = useCallback(
    (uniqueId) => {
      dispatch(removeIngredient(uniqueId));
    },
    [dispatch]
  );

  const handleMove = useCallback(
    (fromIndex, toIndex) => {
      dispatch(moveIngredient({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  // Кнопка «Оформить заказ» диспатчит placeOrder, передавая текущий
  // состав бургера. Слайс order сам обработает pending/fulfilled/rejected.
  // Модалка откроется в App когда в сторе появится orderNumber.
  const handlePlaceOrder = useCallback(() => {
    if (!bun) return;
    dispatch(placeOrder({ bun, fillings }));
  }, [bun, fillings, dispatch]);

  const isHoveringBun = isOver && draggedItem?.type === 'bun';
  const isHoveringFilling = isOver && draggedItem && draggedItem.type !== 'bun';

  // Кнопка неактивна если нет булки (без неё нельзя сделать заказ)
  // или пока летит запрос.
  const isOrderButtonDisabled = !bun || isOrderLoading;

  return (
    <section ref={dropRef} className={`${styles.burger_constructor} pt-25`}>
      {bun ? (
        <div className={styles.bun}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles.placeholder_top} ${
            isHoveringBun ? styles.placeholder_hover : ''
          }`}
        >
          <p className="text text_type_main-default text_color_inactive">
            Выберите булки
          </p>
        </div>
      )}

      {fillings.length > 0 ? (
        <ul className={`${styles.fillings} custom-scroll`}>
          {fillings.map((item, index) => (
            <BurgerConstructorItem
              key={item.uniqueId}
              ingredient={item}
              index={index}
              onMove={handleMove}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      ) : (
        <div
          className={`${styles.placeholder} ${
            isHoveringFilling ? styles.placeholder_hover : ''
          }`}
        >
          <p className="text text_type_main-default text_color_inactive">
            Выберите начинку
          </p>
        </div>
      )}

      {bun ? (
        <div className={styles.bun}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles.placeholder_bottom} ${
            isHoveringBun ? styles.placeholder_hover : ''
          }`}
        >
          <p className="text text_type_main-default text_color_inactive">
            Выберите булки
          </p>
        </div>
      )}

      <div className={`${styles.total} mt-10`}>
        <div className={styles.total_price}>
          <p className="text text_type_digits-medium mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handlePlaceOrder}
          disabled={isOrderButtonDisabled}
        >
          {isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>
    </section>
  );
};
