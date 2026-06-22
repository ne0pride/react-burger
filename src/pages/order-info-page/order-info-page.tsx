import { OrderInfoLoader } from '@components/order-info-loader/order-info-loader';

import styles from './order-info-page.module.css';

// Страница для прямого перехода/перезагрузки /feed/:id и /profile/orders/:id.
// Чек-лист: «при прямом переходе по маршрутам /profile/orders/:id и /feed/:id
// информация о заказе должна отображаться на отдельной странице».
//
// Просто тонкая обёртка над OrderInfoLoader, чтобы добавить page-уровневые
// отступы и центрирование. В модалке (App) OrderInfoLoader используется
// напрямую — без main и без вертикального отступа.
export const OrderInfoPage = () => {
  return (
    <main className={styles.page}>
      <OrderInfoLoader />
    </main>
  );
};
