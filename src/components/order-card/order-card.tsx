import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/slice';

import type { Ingredient, Order, OrderStatus } from '@utils/types';

import styles from './order-card.module.css';

type OrderCardProps = {
  order: Order;
  // Базовый путь, по которому делается переход в детали заказа:
  // '/feed' для ленты или '/profile/orders' для истории.
  basePath: '/feed' | '/profile/orders';
  // В истории заказов показываем статус (Создан/Готовится/Выполнен),
  // в общей ленте — нет (по макетам).
  showStatus?: boolean;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
};

// Сколько кружков-превью ингредиентов показываем в карточке.
// Если ингредиентов больше — на последнем кружке оверлей "+N".
const PREVIEW_LIMIT = 6;

export const OrderCard = ({ order, basePath, showStatus = false }: OrderCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ingredients = useAppSelector(selectIngredients);

  const { previews, overflow, total } = useMemo(() => {
    const byId = new Map<string, Ingredient>();
    for (const ingredient of ingredients) {
      byId.set(ingredient._id, ingredient);
    }
    const all = order.ingredients
      .map((id) => byId.get(id))
      .filter((x): x is Ingredient => x !== undefined);
    const sum = all.reduce((acc, ing) => acc + ing.price, 0);
    const previewList = all.slice(0, PREVIEW_LIMIT);
    const overflowCount = Math.max(0, all.length - PREVIEW_LIMIT);
    return { previews: previewList, overflow: overflowCount, total: sum };
  }, [ingredients, order.ingredients]);

  const handleClick = (): void => {
    // Паттерн "modal as a route": передаём текущий location как background,
    // тогда App нарисует модалку поверх (как для /ingredients/:id в спринте 3).
    navigate(`${basePath}/${order.number}`, {
      state: { background: location },
    });
  };

  const statusClassName =
    order.status === 'done' ? `${styles.status} ${styles.status_done}` : styles.status;

  return (
    <li className={styles.card} onClick={handleClick}>
      <header className={styles.header}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
      </header>
      <h3 className={`${styles.name} text text_type_main-medium mt-6`}>
        {order.name ?? `Заказ #${order.number}`}
      </h3>
      {showStatus && (
        <p className={`${statusClassName} text text_type_main-default mt-2`}>
          {STATUS_LABEL[order.status]}
        </p>
      )}
      <div className={`${styles.bottom} mt-6`}>
        <ul className={styles.previews}>
          {previews.map((ing, index) => {
            const isLast = index === previews.length - 1;
            const showOverlay = isLast && overflow > 0;
            return (
              <li
                key={`${ing._id}-${index}`}
                className={styles.preview_circle}
                style={{ zIndex: previews.length - index }}
              >
                <img
                  src={ing.image_mobile}
                  alt={ing.name}
                  className={`${styles.preview_image} ${
                    showOverlay ? styles.preview_image_dimmed : ''
                  }`}
                />
                {showOverlay && (
                  <span
                    className={`${styles.preview_overlay} text text_type_main-default`}
                  >
                    +{overflow}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <span className={`${styles.price} text text_type_digits-default`}>
          {total}
          <CurrencyIcon type="primary" />
        </span>
      </div>
    </li>
  );
};
