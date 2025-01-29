import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CurrencyType = 'BRL' | 'USD';

type CurrencyState = {
  value: CurrencyType;
};

const initialState: CurrencyState = { value: 'USD' };

const currencySlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<'BRL' | 'USD'>) {
      state.value = action.payload;
    },
  },
});

export type { CurrencyType };
export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
