import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: string;
  isOnline: boolean;
  voiceEnabled: boolean;
  speechRate: number;
  speechVolume: number;
  highContrast: boolean;
  largeText: boolean;
  location: {
    lat?: number;
    lng?: number;
    name?: string;
  };
  notifications: {
    weather: boolean;
    market: boolean;
    tasks: boolean;
  };
}

const initialState: SettingsState = {
  language: 'en',
  isOnline: navigator.onLine,
  voiceEnabled: true,
  speechRate: 1.0,
  speechVolume: 1.0,
  highContrast: false,
  largeText: false,
  location: {},
  notifications: {
    weather: true,
    market: true,
    tasks: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setVoiceEnabled: (state, action: PayloadAction<boolean>) => {
      state.voiceEnabled = action.payload;
    },
    setSpeechSettings: (state, action: PayloadAction<{ rate?: number; volume?: number }>) => {
      if (action.payload.rate !== undefined) {
        state.speechRate = action.payload.rate;
      }
      if (action.payload.volume !== undefined) {
        state.speechVolume = action.payload.volume;
      }
    },
    setAccessibilitySettings: (state, action: PayloadAction<{ highContrast?: boolean; largeText?: boolean }>) => {
      if (action.payload.highContrast !== undefined) {
        state.highContrast = action.payload.highContrast;
      }
      if (action.payload.largeText !== undefined) {
        state.largeText = action.payload.largeText;
      }
    },
    setLocation: (state, action: PayloadAction<{ lat?: number; lng?: number; name?: string }>) => {
      state.location = { ...state.location, ...action.payload };
    },
    setNotificationSettings: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
  },
});

export const {
  setLanguage,
  setOnlineStatus,
  setVoiceEnabled,
  setSpeechSettings,
  setAccessibilitySettings,
  setLocation,
  setNotificationSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;