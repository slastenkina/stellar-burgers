import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

// Получение всех заказов
export const fetchOrders = createAsyncThunk('data/fetchOrders', getOrdersApi);

// Получение одного заказа
export const fetchOrder = createAsyncThunk<TOrder, number>(
  'orders/fetchOrder',
  async (orderNumber, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(orderNumber);
    const order = response.orders[0];
    if (!order) {
      return rejectWithValue('Заказ не найден.');
    }

    return order;
  }
);

// Создание нового заказа
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  orderBurgerApi
);

interface OrdersState {
  orders: TOrder[];
  order: TOrder | null;
  orderRequest: boolean;
  error: string | null;
  orderModalData: TOrder | null;
  loading: boolean;
}

const initialState: OrdersState = {
  orders: [],
  order: null,
  orderRequest: false,
  error: null,
  orderModalData: null,
  loading: false
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
      })

      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { resetOrderModalData } = ordersSlice.actions;
export default ordersSlice.reducer;
