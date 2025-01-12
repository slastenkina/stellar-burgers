import reducer, {
  resetConstructor,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} from '../index'; // Путь к файлу с редьюсером
import { TConstructorIngredient, TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid') // Мокаем uuid для предсказуемости
}));

// Моковые данные для ингредиентов
const mockBun: TIngredient = {
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
};

const mockIngredient: TIngredient = {
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
};

const mockConstructorIngredient: TConstructorIngredient = {
  ...mockIngredient,
  id: 'mock-uuid'
};

const initialState = {
  ingredients: [],
  bun: null
};

describe('constructorSlice', () => {
  it('должен вернуть начальное состояние', () => {
    const result = reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  // Тест для сброса конструктора
  it('должен сбросить конструктор', () => {
    const state = {
      ingredients: [mockConstructorIngredient],
      bun: mockBun
    };
    const result = reducer(state, resetConstructor());
    expect(result.ingredients).toEqual([]);
    expect(result.bun).toBeNull();
  });

  // Тест для установки булки
  it('должен установить булку', () => {
    const result = reducer(initialState, setBun(mockBun));
    expect(result.bun).toEqual(mockBun);
  });

  // Тест для добавления ингредиента
  it('должен добавить ингредиент', () => {
    const result = reducer(initialState, addIngredient(mockIngredient));
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].id).toBe('mock-uuid'); // Проверка, что ID был сгенерирован
    expect(result.ingredients[0].name).toBe(mockIngredient.name);
  });

  // Тест для удаления ингредиента
  it('должен удалить ингредиент', () => {
    const state = {
      ingredients: [mockConstructorIngredient],
      bun: null
    };
    const result = reducer(state, removeIngredient('mock-uuid'));
    expect(result.ingredients).toHaveLength(0);
  });

  // Тест для перемещения ингредиента вверх
  it('должен переместить ингредиент вверх', () => {
    const state = {
      ingredients: [
        { ...mockConstructorIngredient, id: 'ingredient-1' },
        { ...mockIngredient, id: 'ingredient-2' }
      ],
      bun: null
    };
    const result = reducer(state, moveIngredientUp('ingredient-2'));
    expect(result.ingredients[0].id).toBe('ingredient-2');
    expect(result.ingredients[1].id).toBe('ingredient-1');
  });

  // Тест для перемещения ингредиента вниз
  it('должен переместить ингредиент вниз', () => {
    const state = {
      ingredients: [
        { ...mockConstructorIngredient, id: 'ingredient-1' },
        { ...mockIngredient, id: 'ingredient-2' }
      ],
      bun: null
    };
    const result = reducer(state, moveIngredientDown('ingredient-1'));
    expect(result.ingredients[0].id).toBe('ingredient-2');
    expect(result.ingredients[1].id).toBe('ingredient-1');
  });
});
