import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

// Тестовые данные. На следующих спринтах номер будет приходить с сервера.
const ORDER_ID = '034536';

export const OrderDetails = () => {
  return (
    <div className={`${styles.details} pb-30`}>
      <p className={`${styles.order_id} text text_type_digits-large mt-15`}>
        {ORDER_ID}
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
