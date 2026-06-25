import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import { useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/slice';

import type { Ingredient, Order, OrderStatus } from '@utils/types';

import styles from './order-info.module.css';

type OrderInfoProps = {
  order: Order;
};

// Подписи статусов из ТЗ: «Создан», «Готовится», «Выполнен».
const STATUS_LABEL: Record<OrderStatus, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
};

type IngredientRow = {
  ingredient: Ingredient;
  count: number;
};

// Группирует order.ingredients (массив _id с возможными повторами) в строки
// { ingredient, count } и считает итоговую стоимость. Ингредиенты, которых
// нет в загруженном списке (теоретический edge-case), пропускаются.
const buildRows = (
  orderIngredientIds: string[],
  ingredientsById: Map<string, Ingredient>
): { rows: IngredientRow[]; total: number } => {
  const grouped = new Map<string, IngredientRow>();
  for (const id of orderIngredientIds) {
    const ingredient = ingredientsById.get(id);
    if (!ingredient) continue;
    const existing = grouped.get(id);
    if (existing) {
      existing.count += 1;
    } else {
      grouped.set(id, { ingredient, count: 1 });
    }
  }
  const rows = Array.from(grouped.values());
  const total = rows.reduce((sum, r) => sum + r.ingredient.price * r.count, 0);
  return { rows, total };
};

// Универсальная карточка «Информация о заказе». Рендерится одинаково
// и в модалке (/feed/:id, /profile/orders/:id), и на отдельной странице
// (при прямом переходе/перезагрузке). Серверная цена не приходит —
// считаем сами по списку ингредиентов из стора.
export const OrderInfo = ({ order }: OrderInfoProps) => {
  const ingredients = useAppSelector(selectIngredients);

  const { rows, total } = useMemo(() => {
    const byId = new Map<string, Ingredient>();
    for (const ingredient of ingredients) {
      byId.set(ingredient._id, ingredient);
    }
    return buildRows(order.ingredients, byId);
  }, [ingredients, order.ingredients]);

  const statusClassName =
    order.status === 'done' ? `${styles.status} ${styles.status_done}` : styles.status;

  return (
    <div className={styles.container}>
      <p className={`${styles.number} text text_type_digits-default`}>#{order.number}</p>
      <h2 className={`${styles.name} text text_type_main-medium mt-10`}>
        {order.name ?? `Заказ #${order.number}`}
      </h2>
      <p className={`${statusClassName} text text_type_main-default mt-3`}>
        {STATUS_LABEL[order.status]}
      </p>
      <p className="text text_type_main-medium mt-15">Состав:</p>
      <ul className={`${styles.list} custom-scroll mt-6`}>
        {rows.map((row) => (
          <li key={row.ingredient._id} className={styles.row}>
            <div className={styles.thumbnail_wrap}>
              <img
                src={row.ingredient.image_mobile}
                alt={row.ingredient.name}
                className={styles.thumbnail}
              />
            </div>
            <p className="text text_type_main-default">{row.ingredient.name}</p>
            <span className={`${styles.row_price} text text_type_digits-default`}>
              {row.count} x {row.ingredient.price}
              <CurrencyIcon type="primary" />
            </span>
          </li>
        ))}
      </ul>
      <div className={`${styles.footer} mt-10`}>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
        <span className={`${styles.total} text text_type_digits-default`}>
          {total}
          <CurrencyIcon type="primary" />
        </span>
      </div>
    </div>
  );
};
