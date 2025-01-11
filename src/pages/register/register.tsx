import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchRegisterUser } from '../../slices/user';
import { Preloader } from '@ui';
import { useForm } from '../../hooks/useForm';

export const Register: FC = () => {
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });

  const { error, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [localError, setLocalError] = useState<string | null>(null); // Локальное состояние для ошибок

  const { userName, email, password } = values; // Деструктуризация значений формы

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLocalError(null); // Сбрасываем локальную ошибку перед запросом

    try {
      const resultAction = await dispatch(
        fetchRegisterUser({
          name: userName,
          email,
          password
        })
      );

      if (fetchRegisterUser.fulfilled.match(resultAction)) {
        // Если регистрация успешна
        console.log('Registration successful:', resultAction.payload);
      } else if (fetchRegisterUser.rejected.match(resultAction)) {
        // Если произошла ошибка
        setLocalError(resultAction.error.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setLocalError('Произошла непредвиденная ошибка');
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={localError || error || ''} // Отображение ошибок
      email={email}
      userName={userName}
      password={password}
      setEmail={handleChange} // Используем универсальный обработчик
      setPassword={handleChange} // Используем универсальный обработчик
      setUserName={handleChange} // Используем универсальный обработчик
      handleSubmit={handleSubmit}
    />
  );
};
