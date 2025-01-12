import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../slices/feeds';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const { orders, loading, error } = useSelector((state) => ({
    orders: state.feeds.orders,
    loading: state.feeds.loading,
    error: state.feeds.error
  }));

  // Загружаем заказы при монтировании компонента
  useEffect(() => {
    dispatch(fetchFeeds()); // Запрашиваем заказы из API
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
