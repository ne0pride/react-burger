import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructorItem } from '@components/burger-constructor-item/burger-constructor-item';
import { selectIsAuthenticated } from '@services/auth/slice';
import {
  addIngredient,
  moveIngredient,
  removeIngredient,
  selectBun,
  selectFillings,
  selectTotalPrice,
} from '@services/burger-constructor/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { placeOrder } from '@services/order/actions';
import { selectOrderIsLoading } from '@services/order/slice';

import type { Ingredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useAppSelector(selectBun);
  const fillings = useAppSelector(selectFillings);
  const totalPrice = useAppSelector(selectTotalPrice);
  const isOrderLoading = useAppSelector(selectOrderIsLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const sectionRef = useRef<HTMLElement>(null);

  const [{ isOver, draggedItem }, dropRef] = useDrop<
    Ingredient,
    unknown,
    { isOver: boolean; draggedItem: Ingredient | null }
  >({
    accept: 'ingredient',
    drop: (item) => {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      draggedItem: monitor.getItem(),
    }),
  });

  dropRef(sectionRef);

  const handleRemove = useCallback(
    (uniqueId: string) => {
      dispatch(removeIngredient(uniqueId));
    },
    [dispatch]
  );

  const handleMove = useCallback(
    (fromIndex: number, toIndex: number) => {
      dispatch(moveIngredient({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  // Кнопка «Оформить заказ» диспатчит placeOrder, передавая текущий
  // состав бургера. Слайс order сам обработает pending/fulfilled/rejected.
  // Модалка откроется в App когда в сторе появится orderNumber.
  const handlePlaceOrder = useCallback(() => {
    if (!bun) return;
    // Чек-лист: «Заказы могут делать только авторизованные пользователи».
    // Анонима отправляем на /login, запоминая откуда пришли, чтобы после
    // авторизации ProtectedRoute вернул его обратно.
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    dispatch(placeOrder({ bun, fillings }));
  }, [bun, fillings, isAuthenticated, navigate, location, dispatch]);

  const isHoveringBun = isOver && draggedItem?.type === 'bun';
  const isHoveringFilling = isOver && draggedItem && draggedItem.type !== 'bun';

  // Кнопка неактивна если нет булки (без неё нельзя сделать заказ)
  // или пока летит запрос.
  const isOrderButtonDisabled = !bun || isOrderLoading;

  return (
    <section ref={sectionRef} className={`${styles.burger_constructor} pt-25`}>
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
