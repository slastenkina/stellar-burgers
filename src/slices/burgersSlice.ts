import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getIngredientsApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  getUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '@api';

import {
  TIngredient,
  TOrder,
  TOrdersData,
  TConstructorIngredient,
  TUser
} from '@utils-types';

import { v4 as uuidv4 } from 'uuid';

import { getCookie, setCookie } from '../utils/cookie';

// Асинхронные Thunk-функции для запросов к API

// Получение ингредиентов
export const fetchIngredients = createAsyncThunk(
  'data/fetchIngredients',
  getIngredientsApi
);

// Получение всех заказов
export const fetchOrders = createAsyncThunk('data/fetchOrders', getOrdersApi);

// Создание нового заказа
export const createOrder = createAsyncThunk('data/createOrder', orderBurgerApi);

// Получение заказов
export const fetchFeeds = createAsyncThunk('data/fetchFeeds', getFeedsApi);

// Регистрация пользователя
export const fetchRegisterUser = createAsyncThunk(
  'auth/registerUser',
  registerUserApi
);

// Авторизация пользователя
export const fetchLoginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data); // Получаем ответ от API

    // Проверяем, что ответ содержит токены
    if (response.refreshToken && response.accessToken) {
      // Сохраняем токены
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      return response; // Возвращаем данные с токенами
    } else {
      throw new Error('Failed to receive tokens');
    }
  }
);

// Выход пользователя
export const fetchLogoutUser = createAsyncThunk('auth/logoutUser', async () => {
  const response = await logoutApi(); // Сначала делаем запрос
  localStorage.removeItem('refreshToken'); // Затем удаляем токен
  return response;
});

// Обновление токенов
export const refreshUserToken = createAsyncThunk(
  'auth/refreshUserToken',
  refreshToken
);

// Получение данных текущего пользователя
// export const fetchUser = createAsyncThunk<TUser, void>(
//   'auth/fetchUser',
//   async () => {
//     const response = await getUserApi(); // запрос к API
//     return response.user; // возвращаем данные пользователя
//   }
// );

// Обновление данных пользователя
export const updateUser = createAsyncThunk('auth/updateUser', updateUserApi);

//Автологин
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (__, { dispatch }) => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      try {
        const response = await getUserApi(); // response имеет тип TUserResponse
        dispatch(setUser(response.user)); // Передаем объект user в setUser
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        dispatch(setIsAuthChecked(true));
      }
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

// Типы состояний
interface DataState {
  ingredients: TConstructorIngredient[];
  ingredient: TIngredient[];
  orders: TOrder[];
  order: TOrder | null;
  loading: boolean;
  error: string | null;
  bun: TIngredient | null;
  user: TUser | null;
  totalOrders: number;
  totalToday: number;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  orderModalData: TOrder | null;
  orderRequest: boolean;
}

const initialState: DataState = {
  ingredients: [],
  orders: [],
  order: null,
  loading: false,
  error: null,
  bun: null,
  user: null,
  ingredient: [],
  totalOrders: 0,
  totalToday: 0,
  isAuthenticated: false,
  isLoggedIn: false,
  orderModalData: null,
  orderRequest: false
};

// Создание слайса
const burgersSlice = createSlice({
  name: 'burgers',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    },
    setIsAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    // Сбросить данные о заказе
    resetOrderModalData(state) {
      state.orderModalData = null;
    },
    setBun(state, action: PayloadAction<TIngredient | null>) {
      state.bun = action.payload;
    },
    addIngredient: {
      prepare: (payload: TIngredient) => ({
        payload: { ...payload, id: uuidv4() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient.id === id
      );
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    moveIngredientDown(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.ingredients.findIndex(
        (ingredient) => ingredient.id === id
      );
      if (index >= 0 && index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    isLoggedIn(state) {
      state.isLoggedIn = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.ingredient = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      })

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })

      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      // В слайсе обработка успешного выполнения createOrder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })

      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.loading = false;
          state.orders = action.payload.orders;
          state.totalOrders = action.payload.total;
          state.totalToday = action.payload.totalToday;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки данных';
      })

      // Регистрация пользователя
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isLoggedIn = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // Авторизация пользователя
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка авторизации';
      })

      // Выход пользователя
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isLoggedIn = false;
        state.user = { name: '', email: '' };
      })

      // Получение пользователя
      // .addCase(checkUserAuth.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(checkUserAuth.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.isAuthenticated = true;
      //   state.isLoggedIn = true;
      // })
      // .addCase(checkUserAuth.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error =
      //     action.error.message || 'Ошибка получения данных пользователя';
      // })

      // Обновление данных пользователя
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const {
  setUser,
  setIsAuthChecked,
  resetConstructor,
  resetOrderModalData,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  isLoggedIn
} = burgersSlice.actions;
export default burgersSlice.reducer;
