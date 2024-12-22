import { FC, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchIngredients, createOrder } from '../../slices/burgersSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch } from '../../services/store'; // Импортируем тип состояния
import { Preloader } from '@ui';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();

  // Получаем данные из стора
  const { ingredients, loading, error, order } = useSelector(
    (state: RootState) => state.data
  );
  // Селектор для конструктора ингредиентов
  const constructorItems = useMemo(() => {
    const bun = ingredients.find((item) => item.type === 'bun') || null;
    const otherIngredients = ingredients.filter((item) => item.type !== 'bun');
    return {
      bun,
      ingredients: otherIngredients
    };
  }, [ingredients]);

  const orderRequest = loading; // Используем статус загрузки как признак запроса
  const orderModalData = order; // Используем текущий заказ для модального окна

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds = [
      constructorItems.bun._id, // Добавляем булку
      ...constructorItems.ingredients.map((item) => item._id) // И другие ингредиенты
    ];
    dispatch(createOrder(ingredientIds)); // Отправляем заказ
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // Обработаем ошибку (можно вывести сообщение об ошибке)
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  // Показываем индикатор загрузки, пока идет запрос
  if (loading && ingredients.length === 0) {
    return <Preloader />;
  }

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
