import type { ReactNode } from 'react';

import styles from './auth-layout.module.css';

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
  footerLinks?: ReactNode[];
};

// Общая обёртка для страниц /login, /register, /forgot-password, /reset-password.
// Центрирует форму по горизонтали, выводит заголовок, форму и опциональные
// ссылки под ней.
export const AuthLayout = ({ title, children, footerLinks }: AuthLayoutProps) => {
  return (
    <main className={styles.layout}>
      <div className={styles.content}>
        <h1 className={`${styles.title} text text_type_main-medium`}>{title}</h1>
        {children}
        {footerLinks && (
          <ul className={styles.links}>
            {footerLinks.map((item, index) => (
              <li
                key={index}
                className={`${styles.link_row} text text_type_main-default text_color_inactive`}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};
