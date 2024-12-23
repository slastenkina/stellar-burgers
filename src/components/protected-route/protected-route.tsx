// Компонент для защиты маршрутов (дописать и перенести отдельно)
import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyForGuests?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyForGuests = false
}) => {
  const isAuthenticated = useSelector((state) => !!state.data.isAuthenticated); // Проверка авторизации
  const location = useLocation();

  // Защита маршрутов только для авторизованных пользователей
  if (!onlyForGuests && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Защита маршрутов только для гостей (неавторизованных пользователей)
  if (onlyForGuests && isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return children;
};
