import reducer, { fetchIngredients } from '../index';
import { TIngredient } from '@utils-types';

// Моковые данные
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

// Начальное состояние
const initialState = {
  ingredient: [],
  loading: false,
  error: null
};

describe('тесты для ingredientsSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const result = reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('должен установить loading в true при запросе ингредиентов', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = reducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  it('должен обновить состояние ингредиентов при успешном получении данных', () => {
    const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.ingredient).toEqual(mockIngredients);
    expect(result.error).toBeNull();
  });

  it('должен установить ошибку при неудачном запросе', () => {
    const action = fetchIngredients.rejected(
      new Error('Ошибка загрузки ингредиентов'),
      '',
      undefined
    );
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки ингредиентов');
  });
});
