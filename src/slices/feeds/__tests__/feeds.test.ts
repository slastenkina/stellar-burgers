import { configureStore } from '@reduxjs/toolkit';
import reducer, { fetchFeeds } from '../index';

describe('Тесты для feedsSlice', () => {
  // Создаем store с редьюсером feeds
  const store = configureStore({
    reducer: {
      feeds: reducer
    }
  });

  // Начальное состояние
  const initialState = {
    orders: [],
    totalOrders: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  // Тест: начальное состояние
  it('должен вернуть начальное состояние при передаче пустого действия', () => {
    const result = reducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  // Тест: обработка действия fetchFeeds.pending
  it('должен обрабатывать fetchFeeds.pending и устанавливать loading в true', () => {
    const action = { type: fetchFeeds.pending.type };
    const result = reducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  // Тест: обработка действия fetchFeeds.fulfilled
  it('должен обрабатывать fetchFeeds.fulfilled и обновлять состояние с полученными данными', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: {
        orders: [{ id: '1', name: 'Burger' }],
        total: 10,
        totalToday: 2
      }
    };
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.orders).toEqual([{ id: '1', name: 'Burger' }]);
    expect(result.totalOrders).toBe(10);
    expect(result.totalToday).toBe(2);
  });

  // Тест: обработка действия fetchFeeds.rejected
  it('должен обрабатывать fetchFeeds.rejected и устанавливать ошибку в state.error', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Ошибка загрузки данных' }
    };
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки данных');
  });
});
