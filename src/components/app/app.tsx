import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';

import { useDispatch, useSelector } from '../../services/store';

import { fetchIngredients } from '../../slices/burgersSlice';

// Заглушка для проверки авторизации (заменим на реальную логику позже)
const isAuthenticated = false;

// Компонент для защиты маршрутов
import { FC, ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = true; // Пример проверки аутентификации

  if (!isAuthenticated) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;

  const handleModalClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        {/* Основные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Защищенные маршруты */}

        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Динамические маршруты с модалками */}
        <Route
          path='/feed/:number'
          element={
            <Modal title='Детали заказа' onClose={handleModalClose}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={handleModalClose}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
