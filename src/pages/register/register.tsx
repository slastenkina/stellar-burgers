import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchRegisterUser } from '../../slices/burgersSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Для отображения ошибок

  const dispatch = useDispatch();

  const { loading, error: apiError } = useSelector((state) => state.data); // Подключение к стору

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null); // Сбрасываем локальную ошибку перед запросом

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
        setError(resultAction.error.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Произошла непредвиденная ошибка');
    }
  };

  return (
    <RegisterUI
      errorText={error || apiError || ''} // Отображение ошибок
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
