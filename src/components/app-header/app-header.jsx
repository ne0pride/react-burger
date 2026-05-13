import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';

import styles from './app-header.module.css';

export const AppHeader = () => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} pt-5 pb-5`}>
        <div className={styles.menu_part_left}>
          <a
            href="/"
            className={`${styles.link} ${styles.link_active} pt-4 pb-4 pl-5 pr-5`}
          >
            <BurgerIcon type="primary" />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </a>
          <a href="/feed" className={`${styles.link} pt-4 pb-4 pl-5 pr-5`}>
            <ListIcon type="secondary" />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </a>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <a
          href="/profile"
          className={`${styles.link} ${styles.link_position_last} pt-4 pb-4 pl-5 pr-5`}
        >
          <ProfileIcon type="secondary" />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </a>
      </nav>
    </header>
  );
};
