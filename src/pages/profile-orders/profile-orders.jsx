import styles from './profile-orders.module.css';

// Заглушка истории заказов.
// Чек-лист: «добавьте разметку, которая сообщает, что страница
// находится в разработке. Её функциональность вы реализуете
// в следующих спринтах».
export const ProfileOrders = () => {
  return (
    <div className={styles.stub}>
      <p className="text text_type_main-medium">История заказов</p>
      <p className="text text_type_main-default text_color_inactive mt-4">
        Страница находится в разработке
      </p>
    </div>
  );
};
