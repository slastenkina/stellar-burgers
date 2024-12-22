import { FC, useMemo, useEffect } from 'react';
import { fetchIngredients, createOrder } from '../../slices/burgersSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store'; // Импортируем тип состояния
import { Preloader } from '@ui';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();

  // Селектор для данных
  const { bun, ingredients, loading, error, order } = useSelector(
    (state: RootState) => ({
      bun: state.data.bun,
      ingredients: state.data.ingredients,
      loading: state.data.loading,
      error: state.data.error,
      order: state.data.order
    })
  );

  // Переменные для структурирования
  const constructorItems = { bun, ingredients }; // Все ингредиенты для конструктора
  const orderRequest = loading; // Индикатор загрузки
  const orderModalData = order; // Данные заказа

  useEffect(() => {
    // Загружаем ингредиенты при монтировании компонента
    console.log('Инициализация fetchIngredients');
    dispatch(fetchIngredients());
  }, [dispatch]);

  const onOrderClick = () => {
    if (!bun || loading) return;
    const ingredientIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    // Логика закрытия модального окна
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  // Показываем индикатор загрузки, пока идет запрос
  if (loading && ingredients.length === 0) {
    return <Preloader />;
  }

  // Обработаем ошибку (можно вывести сообщение об ошибке)
  if (error) {
    return <div>Ошибка загрузки: {error}</div>;
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
