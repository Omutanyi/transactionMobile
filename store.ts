import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string;
  role: 'psp' | 'dev' | string;
}

const initialState: UserState = {
  email: '',
  role: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUser(state) {
      state.email = '';
      state.role = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
