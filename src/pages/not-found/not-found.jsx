import { Link } from 'react-router-dom';

import styles from './not-found.module.css';

export const NotFound = () => {
  return (
    <main className={styles.not_found}>
      <h1 className={`${styles.code} text`}>404</h1>
      <p className="text text_type_main-medium mt-6">Такой страницы не существует</p>
      <Link to="/" className={`${styles.home_link} text text_type_main-default mt-10`}>
        Вернуться на главную
      </Link>
    </main>
  );
};
