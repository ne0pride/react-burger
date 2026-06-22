import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { AuthLayout } from '@components/auth-layout/auth-layout';
import { register } from '@services/auth/actions';
import { selectAuthError, selectAuthLoading } from '@services/auth/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './register.module.css';

export const Register = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(register({ name, email, password }));
  };

  return (
    <AuthLayout
      title="Регистрация"
      footerLinks={[
        <>
          Уже зарегистрированы?{' '}
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </>,
      ]}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
          placeholder="Имя"
        />
        <EmailInput
          name="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setEmail(event.target.value)
          }
          placeholder="E-mail"
        />
        <PasswordInput
          name="password"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        />
        {error && (
          <p className={`${styles.error} text text_type_main-default`}>{error}</p>
        )}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </AuthLayout>
  );
};
