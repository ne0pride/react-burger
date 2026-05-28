import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectIsAuthenticated } from '@services/auth/slice';

// Универсальный компонент защиты маршрутов.
//
// Параметр onlyUnAuth определяет режим:
//   false (по умолчанию) — пускаем только авторизованных.
//                          Анонимов кидаем на /login, запоминая откуда пришли.
//   true                 — пускаем только анонимных (для /login, /register и т.п.).
//                          Авторизованных кидаем туда, откуда они пришли,
//                          либо на главную.
//
// Чек-лист: «Маршрут /profile и все вложенные в /profile маршруты доступны
// только авторизованным пользователям, то есть защищены HOC-компонентом
// ProtectedRoute». «Маршруты /login и /register, /forgot-password и
// /reset-password недоступны авторизованным пользователям».
export const ProtectedRoute = ({ children, onlyUnAuth = false }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  // Пока не проверили токен — показываем прелоадер.
  // Без этого пользователь, который только что обновил страницу,
  // увидел бы редирект на /login (потому что user пока null),
  // а потом обратно (когда checkAuth завершится).
  if (!isAuthChecked) {
    return (
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Preloader />
      </div>
    );
  }

  // Маршрут только для анонимов (/login, /register и т.п.).
  if (onlyUnAuth && isAuthenticated) {
    // Чек-лист: «После успешной авторизации происходит переадресация
    // на тот маршрут, к которому пользователь не получил доступ ранее».
    // location.state.from кладёт ProtectedRoute, когда редиректит на /login.
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Маршрут только для авторизованных (/profile и вложенные).
  if (!onlyUnAuth && !isAuthenticated) {
    // Запоминаем текущий location в state — после логина вернёмся сюда.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Проверки прошли — рендерим защищаемый контент.
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  onlyUnAuth: PropTypes.bool,
};
