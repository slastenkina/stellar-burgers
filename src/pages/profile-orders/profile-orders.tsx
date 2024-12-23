import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../slices/burgersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.data.orders); // Список заказов
  const loading = useSelector((state) => state.data.loading); // Статус загрузки
  const error = useSelector((state) => state.data.error); // Ошибка, если есть

  useEffect(() => {
    // Диспатчим действие для получения заказов при монтировании компонента
    dispatch(fetchOrders());
  }, [dispatch]);

  // Показываем индикатор загрузки, пока идет запрос
  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
