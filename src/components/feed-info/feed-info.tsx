import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные о заказах
  const { orders, total, totalToday } = useSelector((state) => ({
    orders: state.data.orders,
    total: state.data.totalOrders,
    totalToday: state.data.totalToday
  }));

  // Фильтруем заказы по статусам
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders} // Готовые заказы
      pendingOrders={pendingOrders} // Ожидающие заказы
      feed={{ total, totalToday }} // Передаем переменную feed, которая содержит все заказы
    />
  );
};
