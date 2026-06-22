import { NavLink, Outlet } from 'react-router-dom';

import { logout } from '@services/auth/actions';
import { useAppDispatch } from '@services/hooks';

import styles from './profile.module.css';

type NavLinkRenderProps = {
  isActive: boolean;
};

const linkClassName = ({ isActive }: NavLinkRenderProps) =>
  `${styles.link} text text_type_main-medium ${isActive ? styles.link_active : ''}`;

export const Profile = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Перенаправление на /login после успешного выхода —
    // тоже на этапе 8 (ProtectedRoute).
  };

  return (
    <main className={styles.profile}>
      <nav className={styles.menu}>
        <ul className={styles.menu_list}>
          <li>
            <NavLink to="/profile" end className={linkClassName}>
              Профиль
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile/orders" className={linkClassName}>
              История заказов
            </NavLink>
          </li>
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className={`${styles.link} ${styles.logout_button} text text_type_main-medium`}
            >
              Выход
            </button>
          </li>
        </ul>
        <p className={`${styles.hint} text text_type_main-default text_color_inactive`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>

      <div className={styles.content}>
        <Outlet />
      </div>
    </main>
  );
};
