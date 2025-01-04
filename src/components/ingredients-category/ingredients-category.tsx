import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получаем данные о булке и ингредиентах из Redux
  const { bun, ingredients: selectedIngredients } = useSelector((state) => ({
    bun: state.data.bun,
    ingredients: state.data.ingredients
  }));

  // Используем useMemo для вычисления количества ингредиентов
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};
    // Подсчитываем количество каждого ингредиента
    selectedIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Если булка выбрана, добавляем 2 к счетчику булки
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [bun, selectedIngredients]); // Зависимости useMemo: обновление при изменении bun или ingredients

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
