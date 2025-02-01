import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './features/currency/currencySlice';
import userReducer from './features/user/userSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      currency: currencyReducer,
      user: userReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
