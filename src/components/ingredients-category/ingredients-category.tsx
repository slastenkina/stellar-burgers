import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '@ui';
import { useSelector } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Получаем данные о булке и ингредиентах из Redux
  const { bun, ingredients: selectedIngredients } = useSelector((state) => ({
    bun: state.burger.bun,
    ingredients: state.burger.ingredients
  }));

  // Используем useMemo для вычисления количества ингредиентов
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Проверяем, что selectedIngredients - массив
    (selectedIngredients || []).forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Проверяем, что булка выбрана, и добавляем 2 к счетчику булки
    if (bun) {
      counters[bun._id] = (counters[bun._id] || 0) + 2;
    }

    return counters;
  }, [bun, selectedIngredients]); // Зависимости useMemo: обновление при изменении bun или selectedIngredients

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
