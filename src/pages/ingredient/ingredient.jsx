import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { selectError, selectIngredients } from '@services/ingredients/slice';

import styles from './ingredient.module.css';

// Полноценная страница с деталями ингредиента.
// Рендерится при прямом переходе на /ingredients/:id (без background-state).
export const Ingredient = () => {
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectError);

  // Пока список ещё не загружен — показываем прелоадер.
  // Важно: fetchIngredients диспатчится в useEffect App'а, т.е. ПОСЛЕ
  // первого рендера. На прямом заходе на /ingredients/:id первый рендер
  // случается с пустым items (isLoading тоже ещё false), поэтому опираться
  // на isLoading нельзя — иначе find не найдёт ингредиент и мы ошибочно
  // улетим на 404 до завершения запроса. Поэтому "пустой список без ошибки"
  // трактуем как "ещё грузится".
  if (!error && ingredients.length === 0) {
    return (
      <main className={styles.page}>
        <Preloader />
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-medium">
          Не удалось загрузить ингредиент: {error}
        </p>
      </main>
    );
  }

  // Ищем ингредиент по id из URL.
  const ingredient = ingredients.find((item) => item._id === id);

  // Если ингредиенты уже загрузились, но нужного нет — это 404.
  if (!ingredient) {
    return <Navigate to="/404" replace />;
  }

  return (
    <main className={styles.page}>
      <h1 className={`${styles.title} text text_type_main-large`}>Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </main>
  );
};
