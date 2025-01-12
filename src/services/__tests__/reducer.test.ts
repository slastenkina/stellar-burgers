import { rootReducer, store } from '../store';

describe('Тест для rootReducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    const initial = store.getState(); // Сохраняем начальное состояние хранилища

    // Вызываем rootReducer с состоянием undefined и экшеном 'UNKNOWN_ACTION'
    const unknownAction = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние после вызова редьюсера не изменилось и равно начальному состоянию
    expect(unknownAction).toEqual(initial);
  });
});
