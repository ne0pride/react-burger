import { CheckMarkIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@services/hooks';
import { selectOrderNumber } from '@services/order/slice';

import styles from './order-details.module.css';

export const OrderDetails = () => {
  const orderNumber = useAppSelector(selectOrderNumber);

  // Если номера ещё нет — показываем прелоадер.
  // На практике этот кейс почти не встречается: модалка открывается
  // ТОЛЬКО когда orderNumber уже есть. Но если запрос ещё в процессе,
  // увидим прелоадер.
  if (!orderNumber) {
    return (
      <div className={`${styles.details} pb-30`}>
        <Preloader />
      </div>
    );
  }

  // Форматируем номер с лидирующими нулями до 6 знаков,
  // как в макете (034536).
  const formattedOrderId = String(orderNumber).padStart(6, '0');

  return (
    <div className={`${styles.details} pb-30`}>
      <p className={`${styles.order_id} text text_type_digits-large mt-15`}>
        {formattedOrderId}
      </p>
      <p className={`${styles.label} text text_type_main-medium mt-8`}>
        идентификатор заказа
      </p>
      <div className={`${styles.icon_wrapper} mt-15`}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className={`${styles.status} text text_type_main-default mt-15`}>
        Ваш заказ начали готовить
      </p>
      <p
        className={`${styles.hint} text text_type_main-default text_color_inactive mt-2`}
      >
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
