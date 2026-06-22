import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { OrderInfo } from '@components/order-info/order-info';
import { selectFeedOrders } from '@services/feed/slice';
import { useAppSelector } from '@services/hooks';
import { selectProfileOrders } from '@services/profile-orders/slice';
import { getOrderByNumber } from '@utils/api';

import type { Order } from '@utils/types';

// Универсальный «загрузчик» заказа по номеру из URL.
// Используется и в модалке (App), и на отдельной странице (OrderInfoPage),
// и при прямом переходе/перезагрузке /feed/:id или /profile/orders/:id.
//
// Поиск идёт по обоим WS-снапшотам (feed + profileOrders): пользователь
// мог попасть сюда из любой ленты, и снапшот соответствующего сокета
// может быть уже загружен. Если нигде нет — fallback на GET /api/orders/{number}
// (ТЗ: «По сокет-соединению сервер возвращает только 50 последних заказов
// и интересующего заказа среди них может не быть»).
export const OrderInfoLoader = () => {
  const { id } = useParams();
  const feedOrders = useAppSelector(selectFeedOrders);
  const profileOrders = useAppSelector(selectProfileOrders);

  const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Ищем заказ в обоих стораx по номеру (в URL — order.number).
  const orderFromStore = useMemo<Order | null>(() => {
    if (!id) return null;
    const all = [...feedOrders, ...profileOrders];
    return all.find((order) => String(order.number) === id) ?? null;
  }, [feedOrders, profileOrders, id]);

  // Если в сторе нет — дёргаем GET, но с небольшой задержкой. На прямом
  // заходе родительская страница параллельно открывает WS, и снапшот
  // обычно успевает прийти за пару секунд. Дебаунс даёт WS приоритет
  // и спасает от лишнего 500-ответа в консоли, когда заказ всё равно
  // подъедет через сокет. Если за окно WS не успел — fallback срабатывает.
  useEffect(() => {
    if (!id || orderFromStore) {
      setFetchedOrder(null);
      setFetchError(null);
      setIsFetching(false);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      setIsFetching(true);
      setFetchError(null);
      getOrderByNumber(id)
        .then((order) => {
          if (!cancelled) setFetchedOrder(order);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setFetchError(
            err instanceof Error ? err.message : 'Не удалось загрузить заказ'
          );
        })
        .finally(() => {
          if (!cancelled) setIsFetching(false);
        });
    }, 3000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, orderFromStore]);

  const order = orderFromStore ?? fetchedOrder;

  // Порядок проверок важен: если заказ подъехал через WS пока мы fetch'или
  // и fetch успел упасть с ошибкой — показываем сам заказ, а не stale-ошибку.
  if (order) {
    return <OrderInfo order={order} />;
  }

  if (isFetching) {
    return <Preloader />;
  }

  if (fetchError) {
    return (
      <p className="text text_type_main-medium">
        Не удалось загрузить заказ: {fetchError}
      </p>
    );
  }

  // Начальное состояние / снапшот ещё не пришёл — прелоадер.
  return <Preloader />;
};
