import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoginError = {
  isError: boolean;
  message: string;
};

type LoginState = {
  loading: boolean;
  error: LoginError;
};

const initialState: LoginState = {
  loading: false,
  error: {
    isError: false,
    message: '',
  },
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<LoginError>) {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = loginSlice.actions;
export default loginSlice.reducer;
