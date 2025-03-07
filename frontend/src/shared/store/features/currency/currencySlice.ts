import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrencyState = {
  value: CurrencyType;
};

const initialState: CurrencyState = { value: 'USD' };

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<'BRL' | 'USD'>) {
      state.value = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
