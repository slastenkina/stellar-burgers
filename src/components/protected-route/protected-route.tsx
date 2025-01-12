// Компонент для защиты маршрутов
import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  anonymous?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  anonymous = false
}) => {
  const isLoggedIn = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();
  const from = location.state?.from || '/';

  if (!isAuthenticated) {
    return <Preloader />;
  }

  // Если разрешен неавторизованный доступ, а пользователь авторизован...
  if (anonymous && isLoggedIn) {
    // ...то отправляем его на предыдущую страницу
    return <Navigate to={from} />;
  }

  // Если требуется авторизация, а пользователь не авторизован...
  if (!anonymous && !isLoggedIn) {
    // ...то отправляем его на страницу логин
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
