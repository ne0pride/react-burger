import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderInfoLoader } from '@components/order-info-loader/order-info-loader';
import { feedConnect, feedDisconnect } from '@services/feed/actions';
import { useAppDispatch } from '@services/hooks';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
} from '@services/profile-orders/actions';
import { getAccessToken } from '@utils/auth';
import { ORDERS_FEED_WS_URL, ORDERS_USER_WS_URL } from '@utils/constants';

import styles from './order-info-page.module.css';

const stripBearer = (token: string): string =>
  token.startsWith('Bearer ') ? token.slice(7) : token;

// Страница для прямого перехода/перезагрузки /feed/:id и /profile/orders/:id.
// Чек-лист: «при прямом переходе по маршрутам /profile/orders/:id и /feed/:id
// информация о заказе должна отображаться на отдельной странице».
//
// На прямом заходе у нас нет открытого WS (пользователь не побывал на /feed
// или /profile/orders), а серверный fallback GET /api/orders/{number} на
// момент сдачи стабильно отдаёт 500. Поэтому на этой странице мы сами
// поднимаем соответствующий сокет: feed для /feed/:id или profileOrders
// для /profile/orders/:id (последний защищён ProtectedRoute, токен есть).
// OrderInfoLoader увидит заказ в свежем снапшоте.
//
// При клике из ленты (модалка) эта страница не рендерится — там сокет
// уже открыт самой страницей ленты.
export const OrderInfoPage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isProfileOrders = location.pathname.startsWith('/profile');

  useEffect(() => {
    if (isProfileOrders) {
      const token = getAccessToken();
      if (!token) return;
      dispatch(
        profileOrdersConnect(`${ORDERS_USER_WS_URL}?token=${stripBearer(token)}`)
      );
      return () => {
        dispatch(profileOrdersDisconnect());
      };
    }
    dispatch(feedConnect(ORDERS_FEED_WS_URL));
    return () => {
      dispatch(feedDisconnect());
    };
  }, [dispatch, isProfileOrders]);

  return (
    <main className={styles.page}>
      <OrderInfoLoader />
    </main>
  );
};
