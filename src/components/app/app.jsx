import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  clearIngredient,
  selectIngredientDetails,
} from '@services/ingredient-details/slice';
import { fetchIngredients } from '@services/ingredients/actions';
import {
  selectError,
  selectIngredients,
  selectIsLoading,
} from '@services/ingredients/slice';
import { clearOrder, selectOrderNumber } from '@services/order/slice';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const selectedIngredient = useSelector(selectIngredientDetails);
  const orderNumber = useSelector(selectOrderNumber);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleCloseIngredientModal = useCallback(() => {
    dispatch(clearIngredient());
  }, [dispatch]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  const renderContent = () => {
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
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor />
      </>
    );
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>{renderContent()}</main>

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}

      {orderNumber && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
