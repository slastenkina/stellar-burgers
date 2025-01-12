import { FC } from 'react';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  // Используем useSelector для получения данных о выбранном ингредиенте из хранилища
  const { id } = useParams<{ id: string }>();

  const ingredientData = useSelector((state) =>
    state.ingredients.ingredient.find((ingredient) => ingredient._id === id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
