import { FC, useMemo, useEffect } from 'react';
import { fetchIngredients } from '../../slices/ingredients'; // Загрузка ингредиентов
import { createOrder, resetOrderModalData } from '../../slices/orders'; // Работа с заказом
import { resetConstructor } from '../../slices/constructor'; // Сброс конструктора
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store'; // Импортируем тип состояния
import { Preloader } from '@ui';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Переменные для структурирования
  const constructorItems = useSelector((state: RootState) => state.burger);

  const user = useSelector((state) => state.user.user);

  const { orderRequest, orderModalData } = useSelector((state) => state.orders);

  const { loading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    // Загружаем ингредиенты при монтировании компонента
    dispatch(fetchIngredients());
  }, [dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
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
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  // Показываем индикатор загрузки, пока идет запрос
  if (loading && constructorItems.ingredients.length === 0) {
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
