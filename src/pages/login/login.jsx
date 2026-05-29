import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { login } from '@services/auth/actions';
import { selectAuthError, selectAuthLoading } from '@services/auth/slice';

import styles from './login.module.css';

export const Login = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login({ email, password }));
    // Перенаправление произойдёт автоматически:
    // после успешного login auth.user становится не-null,
    // ProtectedRoute onlyUnAuth (которая защищает /login) увидит
    // авторизованного пользователя и редиректит на location.state.from
    // или на /.
  };

  return (
    <AuthLayout
      title="Вход"
      footerLinks={[
        <>
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </>,
        <>
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </>,
      ]}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <EmailInput
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-mail"
        />
        <PasswordInput
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && (
          <p className={`${styles.error} text text_type_main-default`}>{error}</p>
        )}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </Button>
      </form>
    </AuthLayout>
  );
};
