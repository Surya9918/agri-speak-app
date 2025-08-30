import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import farmSlice from './slices/farmSlice';
import soilSlice from './slices/soilSlice';
import marketSlice from './slices/marketSlice';
import settingsSlice from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    farm: farmSlice,
    soil: soilSlice,
    market: marketSlice,
    settings: settingsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;