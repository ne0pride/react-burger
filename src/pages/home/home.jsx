import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  selectError,
  selectIngredients,
  selectIsLoading,
} from '@services/ingredients/slice';
import { clearOrder, selectOrderNumber } from '@services/order/slice';

import styles from './home.module.css';

export const Home = () => {
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const orderNumber = useSelector(selectOrderNumber);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className={styles.state_message}>
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.state_message}>
        <p className="text text_type_main-medium">Что-то пошло не так: {error}</p>
      </div>
    );
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <main className={styles.main}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor />
        </main>
      </DndProvider>

      {/* Модалка ингредиента теперь рендерится в App через паттерн
          "modal as a route" — поэтому отсюда удалена. */}

      {orderNumber && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
