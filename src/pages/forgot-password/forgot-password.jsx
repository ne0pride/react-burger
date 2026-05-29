import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { requestPasswordReset } from '@utils/api';
import { setPasswordResetRequested } from '@utils/auth';

import styles from './forgot-password.module.css';

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await requestPasswordReset(email);
      // Ставим флаг, чтобы /reset-password стал доступен (этап 8).
      setPasswordResetRequested();
      navigate('/reset-password');
    } catch (err) {
      setError(err.message || 'Не удалось отправить запрос');
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
        <EmailInput
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Укажите e-mail"
        />
        {error && (
          <p className={`${styles.error} text text_type_main-default`}>{error}</p>
        )}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Отправляем...' : 'Восстановить'}
        </Button>
      </form>
    </AuthLayout>
  );
};
