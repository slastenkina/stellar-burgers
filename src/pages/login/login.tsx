import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchLoginUser } from '../../slices/burgersSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { error, loading, isLoggedIn } = useSelector(
    (state: RootState) => state.data
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      // Выполняем вход через dispatch
      await dispatch(fetchLoginUser({ email, password })).unwrap();

      // После успешного логина перенаправляем пользователя на главную страницу
      navigate('/', { replace: true }); // Перенаправление на главную
      console.log('Логин успешен');
    } catch (err) {
      console.error('Ошибка авторизации:', err);
    }
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
