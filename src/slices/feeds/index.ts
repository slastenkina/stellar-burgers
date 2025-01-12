import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData, TOrder } from '@utils-types';

export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', getFeedsApi);

interface FeedsState {
  orders: TOrder[];
  totalOrders: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  orders: [],
  totalOrders: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  }
});

export default feedsSlice.reducer;
