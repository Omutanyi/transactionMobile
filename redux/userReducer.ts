import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  email: string;
  role: 'psp' | 'dev' | string;
  username: string;
  fullName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  handle?: string;
}

const initialState: UserState = {
  email: '',
  role: '',
  username: '',
  fullName: '',
  phone: '',
  bio: '',
  avatar: '',
  handle: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Merge so partial updates (e.g. from the Edit Profile screen) don't wipe
    // out fields that weren't included in the payload.
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return { ...initialState };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
