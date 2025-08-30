import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  phone: string;
  name?: string;
  location?: string;
  farmSize?: string;
  crops?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCompletedOnboarding: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, setLoading, completeOnboarding, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;