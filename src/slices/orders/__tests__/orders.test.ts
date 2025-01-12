import reducer, {
  fetchOrders,
  fetchOrder,
  createOrder,
  resetOrderModalData
} from '../index';
import { TOrder } from '@utils-types';
import { getOrdersApi, getOrderByNumberApi, orderBurgerApi } from '@api';

jest.mock('@api');

// Моковые данные
const mockOrder: TOrder[] = [
  {
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093d'
    ],
    _id: '677fe333133acd001be49359',
    status: 'done',
    name: 'Флюоресцентный био-марсианский бургер',
    createdAt: '2025-01-09T14:54:43.963Z',
    updatedAt: '2025-01-09T14:54:44.898Z',
    number: 65073
  }
];

// Начальное состояние
const initialState = {
  orders: [],
  order: null,
  orderRequest: false,
  error: null,
  orderModalData: null,
  loading: false
};

describe('Тесты для ordersSlice', () => {
  // Тест для fetchOrders.pending
  it('должен установить loading в true при запросе всех заказов', () => {
    const action = { type: fetchOrders.pending.type };
    const result = reducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  // Тест для fetchOrders.fulfilled
  it('должен обновить состояние с заказами при успешном запросе всех заказов', () => {
    const action = fetchOrders.fulfilled(mockOrder, 'someRequestId', undefined);
    const result = reducer(initialState, action);
    expect(result.orders).toEqual(mockOrder);
    expect(result.loading).toBe(false);
  });

  // Тест для fetchOrders.rejected
  it('должен установить ошибку при неудачном запросе всех заказов', () => {
    const action = fetchOrders.rejected(
      { message: 'Ошибка загрузки заказов', name: 'Error' },
      'someRequestId',
      undefined
    );
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки заказов');
  });

  // Тест для fetchOrder.pending
  it('должен установить loading в true при запросе одного заказа', () => {
    const action = { type: fetchOrder.pending.type };
    const result = reducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  // Тест для fetchOrder.fulfilled
  it('должен обновить состояние с заказом при успешном запросе одного заказа', () => {
    const action = fetchOrder.fulfilled(
      mockOrder[0],
      'someRequestId',
      mockOrder[0].number
    );
    const result = reducer(initialState, action);
    expect(result.order).toEqual(mockOrder[0]);
    expect(result.loading).toBe(false);
  });

  // Тест для fetchOrder.rejected
  it('должен не обновить состояние и оставить loading при неудачном запросе одного заказа', () => {
    const action = fetchOrder.rejected(
      new Error('Заказ не найден.'),
      'someRequestId',
      12345
    );
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.order).toBeNull();
  });

  // Тест для createOrder.pending
  it('должен установить orderRequest в true при создании нового заказа', () => {
    const action = { type: createOrder.pending.type };
    const result = reducer(initialState, action);
    expect(result.orderRequest).toBe(true);
  });

  // Тест для createOrder.fulfilled
  it('должен обновить orderModalData при успешном создании нового заказа', () => {
    const action = createOrder.fulfilled(
      { order: mockOrder[0], name: 'TEST', success: true },
      'someRequestId',
      mockOrder[0].ingredients
    );
    const result = reducer(initialState, action);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toEqual(mockOrder[0]);
  });

  // Тест для createOrder.rejected
  it('должен установить ошибку при неудачном создании нового заказа', () => {
    const action = createOrder.rejected(
      new Error('Ошибка создания заказа'),
      'someRequestId',
      []
    );
    const result = reducer(initialState, action);
    expect(result.orderRequest).toBe(false);
    expect(result.error).toBe('Ошибка создания заказа');
  });

  // Тест для resetOrderModalData
  it('должен сбросить orderModalData при вызове resetOrderModalData', () => {
    const action = resetOrderModalData();
    const result = reducer(
      {
        ...initialState,
        orderModalData: mockOrder[0]
      },
      action
    );
    expect(result.orderModalData).toBeNull();
  });
});
