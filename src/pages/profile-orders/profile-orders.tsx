import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
} from '@services/profile-orders/actions';
import {
  selectProfileOrders,
  selectProfileOrdersError,
  TOKEN_INVALID_MESSAGE,
} from '@services/profile-orders/slice';
import { refreshToken } from '@utils/api';
import { getAccessToken } from '@utils/auth';
import { ORDERS_USER_WS_URL } from '@utils/constants';

import styles from './profile-orders.module.css';

// Чек-лист: «Для обращения по сокет-соединению используйте только токен,
// без Bearer». Наш getAccessToken возвращает строку с префиксом Bearer
// (так его кладёт API после login/register), поэтому отрезаем.
const stripBearer = (token: string): string =>
  token.startsWith('Bearer ') ? token.slice(7) : token;

const buildUserOrdersUrl = (rawToken: string): string =>
  `${ORDERS_USER_WS_URL}?token=${rawToken}`;

export const ProfileOrders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectProfileOrders);
  const error = useAppSelector(selectProfileOrdersError);

  // Открываем сокет на текущем токене при входе на страницу,
  // закрываем при уходе. Чек-лист: «Сокет открывается при переходе
  // на экраны лент и закрывается, когда пользователь покидает их».
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    dispatch(profileOrdersConnect(buildUserOrdersUrl(stripBearer(token))));
    return () => {
      dispatch(profileOrdersDisconnect());
    };
  }, [dispatch]);

  // Реакция на устаревший токен. Чек-лист: «Реализована обработка ситуации
  // с устаревшим токеном доступа при подключении по веб-сокету в ленте
  // заказов в профиле». Сервер шлёт сообщение { success: false,
  // message: 'Invalid or missing token' } через тот же канал — слайс
  // прокидывает его в error. Здесь обновляем токен и переподключаемся.
  useEffect(() => {
    if (error !== TOKEN_INVALID_MESSAGE) return;
    let cancelled = false;
    void refreshToken()
      .then((data) => {
        if (cancelled) return;
        dispatch(
          profileOrdersConnect(buildUserOrdersUrl(stripBearer(data.accessToken)))
        );
      })
      .catch(() => {
        // refresh не сработал — отключаемся; ProtectedRoute на /profile
        // отреагирует на отсутствие user через checkAuth, если что.
        if (!cancelled) dispatch(profileOrdersDisconnect());
      });
    return () => {
      cancelled = true;
    };
  }, [error, dispatch]);

  return (
    <div className={styles.list_wrap}>
      <ul className={`${styles.list} custom-scroll`}>
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            basePath="/profile/orders"
            showStatus
          />
        ))}
      </ul>
    </div>
  );
};
