import reducer, {
  fetchRegisterUser,
  fetchLoginUser,
  fetchLogoutUser,
  updateUser,
  setUser,
  setIsAuthChecked,
  isLoggedIn
} from '../index';
import { TUser } from '@utils-types';
import { TAuthResponse } from '@api';

jest.mock('@api');

// Моковые данные
const mockUser: TUser = {
  email: 'test@yandex.ru',
  name: 'Test'
};

const mockRegister = {
  email: 'test@yandex.ru',
  name: 'Test',
  password: 'test123'
};

const mockLogin = {
  email: 'test@yandex.ru',
  password: 'test123'
};

// Моковый ответ с добавлением refreshToken и accessToken
const mockResponse: TAuthResponse = {
  success: true,
  refreshToken: 'someRefreshToken',
  accessToken: 'someAccessToken',
  user: mockUser // mockUser должен быть подходящим объектом типа TUser
};

// Начальное состояние
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoggedIn: false,
  loading: false,
  error: null
};

describe('Тесты для userSlice', () => {
  // Тест для fetchRegisterUser.pending
  it('должен установить loading в true при регистрации пользователя', () => {
    const action = fetchRegisterUser.pending('someRequestId', mockRegister);
    const result = reducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  // Тест для fetchRegisterUser.fulfilled
  it('должен установить пользователя и изменить состояние на авторизованное при успешной регистрации', () => {
    const action = fetchRegisterUser.fulfilled(
      mockResponse, // Передаем мокированный ответ
      'requestId',
      mockRegister
    );

    const result = reducer(initialState, action);

    expect(result.loading).toBe(false);
    expect(result.isAuthenticated).toBe(true);
    expect(result.isLoggedIn).toBe(true);
    expect(result.user).toEqual(mockUser); // Проверка что пользователь установлен
  });

  // Тест для fetchRegisterUser.rejected
  it('должен установить ошибку при неудачной регистрации', () => {
    const action = fetchRegisterUser.rejected(
      new Error('Ошибка регистрации'),
      'requestId',
      mockRegister
    );
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Ошибка регистрации');
  });

  // Тест для fetchLoginUser.pending
  it('должен установить loading в true при авторизации пользователя', () => {
    const action = fetchLoginUser.pending('someRequestId', mockLogin);
    const result = reducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  // Тест для fetchLoginUser.fulfilled
  it('должен обновить данные пользователя и состояние при успешной авторизации', () => {
    const action = fetchLoginUser.fulfilled(
      mockResponse,
      'requestId',
      mockLogin
    );
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.isAuthenticated).toBe(true);
    expect(result.isLoggedIn).toBe(true);
    expect(result.user).toEqual(mockUser);
  });

  // Тест для fetchLoginUser.rejected
  it('должен установить ошибку при неудачной авторизации', () => {
    const action = fetchLoginUser.rejected(
      new Error('Ошибка авторизации'),
      'requestId',
      mockLogin
    );
    const result = reducer(initialState, action);
    expect(result.loading).toBe(false);
    expect(result.error).toBe('Ошибка авторизации');
  });

  // Тест для fetchLogoutUser.fulfilled
  it('должен сбросить состояние пользователя при успешном выходе', () => {
    const action = { type: fetchLogoutUser.fulfilled.type };
    const loggedInState = {
      ...initialState,
      user: mockUser,
      isAuthenticated: true,
      isLoggedIn: true
    };
    const result = reducer(loggedInState, action);
    expect(result.isAuthenticated).toBe(false);
    expect(result.isLoggedIn).toBe(false);
    expect(result.user).toEqual({ name: '', email: '' });
  });

  // Тест для updateUser.fulfilled
  it('должен обновить данные пользователя при успешном обновлении', () => {
    const action = updateUser.fulfilled(mockResponse, 'requestId', mockUser);
    const result = reducer({ ...initialState, user: mockUser }, action);
    expect(result.user).toEqual(mockUser);
  });

  // Тест для setUser
  it('должен установить данные пользователя с помощью setUser', () => {
    const action = setUser(mockUser);
    const result = reducer(initialState, action);
    expect(result.user).toEqual(mockUser);
  });

  // Тест для setIsAuthChecked
  it('должен установить isAuthenticated с помощью setIsAuthChecked', () => {
    const action = setIsAuthChecked(true);
    const result = reducer(initialState, action);
    expect(result.isAuthenticated).toBe(true);
  });

  // Тест для isLoggedIn
  it('должен установить isLoggedIn в true', () => {
    const action = isLoggedIn();
    const result = reducer(initialState, action);
    expect(result.isLoggedIn).toBe(true);
  });
});
