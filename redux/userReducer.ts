import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  email: string;
  role: 'psp' | 'dev' | string;
  username: string;
}

const initialState: UserState = {
  email: '',
  role: '',
  username: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    clearUser(state) {
      state.email = '';
      state.username = '';
      state.role = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
