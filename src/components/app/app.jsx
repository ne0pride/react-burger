import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients } from '@utils/api';

import styles from './app.module.css';

export const App = () => {
  // Данные с сервера и состояния запроса.
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние модалок.
  const [activeModal, setActiveModal] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  // Запрос к API за ингредиентами при монтировании App.
  // Чек-лист: «Запрос к API за информацией об ингредиентах работает корректно
  // и выполняется единожды при монтировании компонента App».
  useEffect(() => {
    getIngredients()
      .then((data) => {
        setIngredients(data);
      })
      .catch((err) => {
        // Чек-лист: «Цепочка обработки промисов завершается блоком catch».
        console.error('Ошибка загрузки ингредиентов:', err);
        setError(typeof err === 'string' ? err : 'Не удалось загрузить ингредиенты');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleIngredientClick = useCallback((ingredient) => {
    setSelectedIngredient(ingredient);
    setActiveModal('ingredient');
  }, []);

  const handleOrderClick = useCallback(() => {
    setActiveModal('order');
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
    setSelectedIngredient(null);
  }, []);

  // Контент main-области меняется в зависимости от состояния запроса.
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
        <BurgerIngredients
          ingredients={ingredients}
          onIngredientClick={handleIngredientClick}
        />
        <BurgerConstructor ingredients={ingredients} onOrderClick={handleOrderClick} />
      </>
    );
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>{renderContent()}</main>

      {activeModal === 'ingredient' && selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}

      {activeModal === 'order' && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
