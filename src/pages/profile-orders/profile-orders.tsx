import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../slices/orders';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const {
    orders: orders,
    loading: loading,
    error
  } = useSelector((state) => state.orders);

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
