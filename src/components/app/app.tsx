import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  type Location,
} from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderInfoLoader } from '@components/order-info-loader/order-info-loader';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { Feed } from '@pages/feed/feed';
import { ForgotPassword } from '@pages/forgot-password/forgot-password';
import { Home } from '@pages/home/home';
import { Ingredient } from '@pages/ingredient/ingredient';
import { Login } from '@pages/login/login';
import { NotFound } from '@pages/not-found/not-found';
import { OrderInfoPage } from '@pages/order-info-page/order-info-page';
import { ProfileForm } from '@pages/profile-form/profile-form';
import { ProfileOrders } from '@pages/profile-orders/profile-orders';
import { Profile } from '@pages/profile/profile';
import { Register } from '@pages/register/register';
import { ResetPassword } from '@pages/reset-password/reset-password';
import { checkAuth } from '@services/auth/actions';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { clearIngredient } from '@services/ingredient-details/slice';
import { fetchIngredients } from '@services/ingredients/actions';
import { selectIngredients } from '@services/ingredients/slice';

import styles from './app.module.css';

// Контент модалки. Ингредиент ищем по :id в загруженном списке, а НЕ в сторе
// выбранного ингредиента: при перезагрузке страницы с открытой модалкой
// (браузер сохраняет background в history.state) стор сбрасывается, и чтение
// из него дало бы пустую модалку. Поиск по списку переживает перезагрузку.
const IngredientModalContent = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectIngredients);
  const ingredient = ingredients.find((item) => item._id === id);
  // Список ещё не подгрузился после перезагрузки — показываем прелоадер.
  if (!ingredient) return <Preloader />;
  return <IngredientDetails ingredient={ingredient} />;
};

// state у location в react-router типизирован как unknown — сужаем
// до ожидаемой формы (background присутствует только при клике
// по карточке через navigate(..., { state: { background: location } })).
type BackgroundState = {
  background?: Location;
};

export const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Если в state есть background — мы попали сюда через клик по карточке.
  // Тогда основные Routes рендерим по background-маршруту (фон не меняется),
  // а /ingredients/:id рендерим отдельно как модалку поверх.
  const state = location.state as BackgroundState | null;
  const background = state?.background;

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Ингредиенты грузим в App (не в Home), чтобы при прямом заходе
  // на /ingredients/:id мы могли найти ингредиент по id.
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleCloseIngredientModal = useCallback(() => {
    dispatch(clearIngredient());
    navigate(-1);
  }, [dispatch, navigate]);

  // Закрытие модалки заказа — просто шаг назад в истории; своего
  // слайса под текущий заказ нет, чистить нечего.
  const handleCloseOrderModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные Routes. location={background || location} — это и есть
          магия паттерна. Если есть background, при URL /ingredients/:id
          React Router выберет background-маршрут как активный (т.е. /).
          А под Modal-маршрут пойдёт вторая <Routes> ниже. */}
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:id" element={<OrderInfoPage />} />
        <Route path="/ingredients/:id" element={<Ingredient />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<ProfileOrders />} />
        </Route>
        {/* Маршрут /profile/orders/:id — отдельная страница БЕЗ боковой
            навигации профиля (по макету), но всё ещё защищён. */}
        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRoute>
              <OrderInfoPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Дополнительные Routes — рендерятся только когда есть background.
          Маршрут /ingredients/:id здесь = модалка поверх фона. */}
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
                <IngredientModalContent />
              </Modal>
            }
          />
          <Route
            path="/feed/:id"
            element={
              <Modal onClose={handleCloseOrderModal}>
                <OrderInfoLoader />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:id"
            element={
              <ProtectedRoute>
                <Modal onClose={handleCloseOrderModal}>
                  <OrderInfoLoader />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};
