import { FC, SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchLoginUser, checkUserAuth } from '../../slices/burgersSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';
import { useForm } from '../../hooks/useForm';
import { setCookie, getCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const { error, loading, isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.data
  );

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, isAuthenticated]);

  // Предыдущий маршрут или корень сайта
  const from = location.state?.from?.pathname || '/';

  // Если пользователь уже авторизован, перенаправляем на предыдущую страницу
  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(fetchLoginUser(values)).unwrap();
      // Сохраняем токены
      console.log('Логин успешен:', result); // Логируем результат
      setCookie('accessToken', result.accessToken, { path: '/' });
      localStorage.setItem('refreshToken', result.refreshToken);
      // Проверяем авторизацию после логина
      dispatch(checkUserAuth());
    } catch (err) {
      console.error('Ошибка авторизации:', err);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={values.email}
      setEmail={handleChange}
      password={values.password}
      setPassword={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
