import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  TLoginData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { getCookie, setCookie } from '../../utils/cookie';

export const fetchRegisterUser = createAsyncThunk(
  'user/registerUser',
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

// Обновление данных пользователя
export const updateUser = createAsyncThunk('auth/updateUser', updateUserApi);

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

interface UserState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoggedIn: false,
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    },
    setIsAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    isLoggedIn(state) {
      state.isLoggedIn = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
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
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isLoggedIn = false;
        state.user = { name: '', email: '' };
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { setUser, setIsAuthChecked, isLoggedIn } = userSlice.actions;
export default userSlice.reducer;
