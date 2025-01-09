import { FC, useMemo, useEffect } from 'react';
import {
  fetchIngredients,
  createOrder,
  resetConstructor,
  resetOrderModalData
} from '../../slices/burgersSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store'; // Импортируем тип состояния
import { Preloader } from '@ui';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Селектор для данных
  const { bun, ingredients, loading, error, orderRequest, orderModalData } =
    useSelector((state: RootState) => ({
      bun: state.data.bun,
      ingredients: state.data.ingredients,
      loading: state.data.loading,
      error: state.data.error,
      orderRequest: state.data.orderRequest,
      orderModalData: state.data.orderModalData
    }));

  // Переменные для структурирования
  const constructorItems = { bun, ingredients }; // Все ингредиенты для конструктора

  const user = useSelector((state) => state.data.user);

  useEffect(() => {
    // Загружаем ингредиенты при монтировании компонента
    dispatch(fetchIngredients());
  }, [dispatch]);

  const onOrderClick = () => {
    if (!bun || loading) return;
    const ingredientIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];
    if (!user) {
      return navigate('/login');
    }
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(resetConstructor());
    dispatch(resetOrderModalData());
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
