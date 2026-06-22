import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

import { updateProfile } from '@services/auth/actions';
import { selectAuthError, selectAuthLoading, selectUser } from '@services/auth/slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './profile-form.module.css';

export const ProfileForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  // Поля формы — управляемые. Инициализируются данными из user.
  // Пароль всегда стартует пустым (чек-лист: «Поле с паролем оставьте пустым»).
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  // Когда user в сторе обновляется (например после updateProfile или checkAuth),
  // подтягиваем актуальные значения в форму. Пароль обнуляем.
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
    }
  }, [user]);

  // Кнопки «Сохранить»/«Отмена» появляются если хоть одно поле отличается
  // от исходных данных пользователя.
  // Чек-лист: «Если пользователь отредактировал данные в форме,
  // то появляются кнопки "Отмена" и "Сохранить"».
  const isModified =
    name !== (user?.name || '') || email !== (user?.email || '') || password !== '';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isModified) return;
    // Чек-лист: «Если пользователь не редактировал поле пароля,
    // отправляйте в качестве пароля пустую строку».
    // У нас именно так: пустая password = не меняем.
    dispatch(updateProfile({ name, email, password }));
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPassword('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        name="name"
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
        placeholder="Имя"
        icon="EditIcon"
      />
      <EmailInput
        name="email"
        value={email}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
        placeholder="Логин"
        isIcon={true}
      />
      <PasswordInput
        name="password"
        value={password}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setPassword(event.target.value)
        }
        icon="EditIcon"
      />
      {error && <p className={`${styles.error} text text_type_main-default`}>{error}</p>}
      {isModified && (
        <div className={styles.buttons}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            {isLoading ? 'Сохраняем...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </form>
  );
};
