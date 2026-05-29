import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateProfile } from '@services/auth/actions';
import { selectAuthError, selectAuthLoading, selectUser } from '@services/auth/slice';

import styles from './profile-form.module.css';

export const ProfileForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

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

  const handleSubmit = (event) => {
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
        onChange={(event) => setName(event.target.value)}
        placeholder="Имя"
        icon="EditIcon"
      />
      <EmailInput
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Логин"
        isIcon={true}
      />
      <PasswordInput
        name="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
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
