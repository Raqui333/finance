import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './features/currency/currencySlice';
import userReducer from './features/user/userSlice';

import loginReducer from '@/features/auth/features/login/loginSlice';
import registerReducer from '@/features/auth/features/register/registerSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      currency: currencyReducer,
      user: userReducer,
      login: loginReducer,
      register: registerReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
