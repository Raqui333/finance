import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserState = {
  name: string;
  entries: UserEntry[];
};

const initialState: UserState = {
  name: 'N/A',
  entries: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setEntry(state, action: PayloadAction<UserEntry[]>) {
      state.entries = action.payload;
    },
    addEntry(state, action: PayloadAction<UserEntry>) {
      state.entries.push(action.payload);
    },
    removeEntry(state, action: PayloadAction<number | undefined>) {
      const index_to_remove = state.entries.findIndex(
        (entry) => entry.id === action.payload
      );
      state.entries.splice(index_to_remove, 1);
    },
  },
});

export const { setName, setEntry, addEntry, removeEntry } = userSlice.actions;
export default userSlice.reducer;
