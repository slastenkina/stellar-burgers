import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getIngredientsApi,
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
  TNewOrderResponse
} from '@api';

import {
  TIngredient,
  TOrder,
  TOrdersData,
  TConstructorIngredient,
  TUser
} from '@utils-types';

import { v4 as uuidv4 } from 'uuid';

// Асинхронные Thunk-функции для запросов к API

// Получение ингредиентов
export const fetchIngredients = createAsyncThunk(
  'data/fetchIngredients',
  async () => getIngredientsApi()
);

// Получение всех заказов
export const fetchOrders = createAsyncThunk('data/fetchOrders', async () =>
  getOrdersApi()
);

// Создание нового заказа
export const createOrder = createAsyncThunk(
  'data/createOrder',
  async (ingredients: string[]) => orderBurgerApi(ingredients)
);

// Получение заказов
export const fetchFeeds = createAsyncThunk('data/fetchFeeds', async () =>
  getFeedsApi()
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
  user: TUser;
}

const initialState: DataState = {
  ingredients: [],
  orders: [],
  order: null,
  loading: false,
  error: null,
  bun: null,
  user: {
    name: '',
    email: ''
  },
  ingredient: []
};

// Создание слайса
const burgersSlice = createSlice({
  name: 'burgers',
  initialState,
  reducers: {
    resetConstructor(state) {
      state.bun = null;
      state.ingredients = [];
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
          console.log('Загруженные ингредиенты:', action.payload);
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
        state.loading = true;
      })
      // В слайсе обработка успешного выполнения createOrder
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          state.loading = false;
          // Извлекаем order из payload
          state.orders.push(action.payload.order); // Добавляем новый заказ
        }
      )

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
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
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки данных';
      });
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown
} = burgersSlice.actions;
export default burgersSlice.reducer;
