import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

import styles from './app-header.module.css';

// Хелпер для условного класса по isActive у NavLink.
// Возвращает строку с базовым классом + активным (если isActive).
const linkClassName = ({ isActive }) =>
  `${styles.link} ${isActive ? styles.link_active : ''}`;

const lastLinkClassName = ({ isActive }) =>
  `${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`;

export const AppHeader = () => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink to="/" end className={linkClassName}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink to="/feed" className={(props) => `${linkClassName(props)} ml-10`}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        {/* Логотип-ссылка ведёт на главную, но без active-стиля (это бренд). */}
        <Link to="/" className={styles.logo}>
          <Logo />
        </Link>
        <NavLink to="/profile" className={lastLinkClassName}>
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className="text text_type_main-default ml-2">Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
