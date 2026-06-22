import { useEffect, useMemo } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { feedConnect, feedDisconnect } from '@services/feed/actions';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@services/feed/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { ORDERS_FEED_WS_URL } from '@utils/constants';

import type { Order } from '@utils/types';

import styles from './feed.module.css';

// Максимум 10 номеров в одной колонке статуса; максимум 2 колонки на статус.
// Лишние записи игнорируем (явное требование ТЗ).
const NUMBERS_PER_COLUMN = 10;
const MAX_COLUMNS_PER_STATUS = 2;

const chunkOrders = (orders: Order[], size: number): Order[][] => {
  const chunks: Order[][] = [];
  for (let i = 0; i < orders.length; i += size) {
    chunks.push(orders.slice(i, i + size));
  }
  return chunks;
};

export const Feed = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);

  // Открываем WebSocket при входе на /feed и закрываем при уходе.
  // Чек-лист: «Сокет-соединение открывается, когда пользователь переходит
  // на экраны ленты, и закрывается, когда пользователь покидает их».
  useEffect(() => {
    dispatch(feedConnect(ORDERS_FEED_WS_URL));
    return () => {
      dispatch(feedDisconnect());
    };
  }, [dispatch]);

  // Делим заказы на «Готовы» (status==='done') и «В работе» (created/pending),
  // потом каждый список бьём на колонки по 10 элементов (max 2 колонки).
  const { doneColumns, inWorkColumns } = useMemo(() => {
    const done: Order[] = [];
    const inWork: Order[] = [];
    for (const order of orders) {
      if (order.status === 'done') done.push(order);
      else inWork.push(order);
    }
    return {
      doneColumns: chunkOrders(done, NUMBERS_PER_COLUMN).slice(
        0,
        MAX_COLUMNS_PER_STATUS
      ),
      inWorkColumns: chunkOrders(inWork, NUMBERS_PER_COLUMN).slice(
        0,
        MAX_COLUMNS_PER_STATUS
      ),
    };
  }, [orders]);

  return (
    <main className={styles.feed}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5`}>
        Лента заказов
      </h1>
      <div className={styles.container}>
        <section className={styles.list_section}>
          <ul className={`${styles.list} custom-scroll`}>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} basePath="/feed" />
            ))}
          </ul>
        </section>

        <aside className={styles.stats}>
          <div className={styles.status_block}>
            <div className={styles.status_group}>
              <p className="text text_type_main-medium">Готовы:</p>
              <div className={styles.numbers_columns}>
                {doneColumns.map((column, columnIndex) => (
                  <ul key={columnIndex} className={styles.numbers_column}>
                    {column.map((order) => (
                      <li
                        key={order._id}
                        className={`${styles.number_done} text text_type_digits-default`}
                      >
                        {order.number}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
            <div className={styles.status_group}>
              <p className="text text_type_main-medium">В работе:</p>
              <div className={styles.numbers_columns}>
                {inWorkColumns.map((column, columnIndex) => (
                  <ul key={columnIndex} className={styles.numbers_column}>
                    {column.map((order) => (
                      <li key={order._id} className="text text_type_digits-default">
                        {order.number}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.totals_block}>
            <p className="text text_type_main-medium">Выполнено за всё время:</p>
            <p className={`${styles.totals_number} text text_type_digits-large`}>
              {total.toLocaleString('ru-RU')}
            </p>
          </div>

          <div className={styles.totals_block}>
            <p className="text text_type_main-medium">Выполнено за сегодня:</p>
            <p className={`${styles.totals_number} text text_type_digits-large`}>
              {totalToday}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};
