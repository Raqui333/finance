import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  name: string;
  balance: number;
  entries: UserEntry[];
};

const initialState: UserState = {
  name: 'RAQUI',
  balance: 0,
  entries: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setBalance(state, action: PayloadAction<number>) {
      state.balance += action.payload;
    },
    addEntry(state, action: PayloadAction<UserEntry>) {
      if (!state.entries) state.entries = [];
      state.entries.push(action.payload);
    },
    removeEntry(state, action: PayloadAction<number>) {
      const index_to_remove = state.entries.findIndex(
        (entry) => entry.date === action.payload
      );

      state.balance -= state.entries[index_to_remove].price;
      state.entries.splice(index_to_remove, 1);
    },
  },
});

export const { setName, setBalance, addEntry, removeEntry } = userSlice.actions;
export default userSlice.reducer;
