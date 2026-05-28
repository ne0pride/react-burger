import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { confirmPasswordReset } from '@utils/api';
import { clearPasswordResetRequested, isPasswordResetRequested } from '@utils/auth';

import styles from './reset-password.module.css';

export const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Защита маршрута: пускаем только тех, кто перед этим прошёл через
  // /forgot-password. Иначе перенаправляем туда.
  // Чек-лист: «пользователь может попасть на страницу ResetPasswordPage,
  // только если он перед этим побывал на странице ForgotPasswordPage».
  if (!isPasswordResetRequested()) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await confirmPasswordReset({ password, token });
      // Снимаем флаг — повторный заход на /reset-password снова потребует
      // прохождения /forgot-password.
      clearPasswordResetRequested();
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Не удалось сбросить пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Восстановление пароля"
      footerLinks={[
        <>
          Вспомнили пароль?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </>,
      ]}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordInput
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Введите новый пароль"
        />
        <Input
          type="text"
          name="token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Введите код из письма"
        />
        {error && (
          <p className={`${styles.error} text text_type_main-default`}>{error}</p>
        )}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Сохраняем...' : 'Сохранить'}
        </Button>
      </form>
    </AuthLayout>
  );
};
