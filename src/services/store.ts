import { configureStore, combineReducers } from '@reduxjs/toolkit';
import constructorSlice from '../slices/constructor';
import feedsSlice from '../slices/feeds';
import ingredientsSlice from '../slices/ingredients';
import ordersSlice from '../slices/orders';
import userSlice from '../slices/user';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  burger: constructorSlice,
  feeds: feedsSlice,
  ingredients: ingredientsSlice,
  orders: ordersSlice,
  user: userSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
