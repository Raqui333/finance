import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type RegisterError = {
  isError: boolean;
  message: string;
};

type RegisterState = {
  loading: boolean;
  error: RegisterError;
};

const initialState: RegisterState = {
  loading: false,
  error: {
    isError: false,
    message: '',
  },
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<RegisterError>) {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = registerSlice.actions;
export default registerSlice.reducer;
