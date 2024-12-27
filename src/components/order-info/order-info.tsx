import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, redirect } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrder } from '../../slices/burgersSlice';

export const OrderInfo: FC = () => {
  const params = useParams<{ number: string }>();
  const dispatch = useDispatch();

  // Данные из хранилища
  // const orders = useSelector((state) => state.data.orders);
  // const orderData = orders.find(
  //   (item) => item.number === parseInt(params.number!)
  // );

  const orderData = useSelector((state) => state.data.order);

  const ingredients: TIngredient[] = useSelector(
    (state) => state.data.ingredient
  );

  useEffect(() => {
    if (!orderData && params.number) {
      dispatch(fetchOrder(Number(params)));
    }
  }, [orderData, params.number, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
