import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  lastUpdated: string;
  location?: {
    lat: number;
    lng: number;
    fieldName?: string;
  };
}

interface SoilReport {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  deficiencies: string[];
  strengths: string[];
}

interface SoilState {
  currentSoilData: SoilData | null;
  soilHistory: SoilData[];
  soilReport: SoilReport | null;
  isLoading: boolean;
}

const initialState: SoilState = {
  currentSoilData: null,
  soilHistory: [],
  soilReport: null,
  isLoading: false,
};

const soilSlice = createSlice({
  name: 'soil',
  initialState,
  reducers: {
    setSoilData: (state, action: PayloadAction<SoilData>) => {
      state.currentSoilData = action.payload;
      state.soilHistory.unshift(action.payload);
      // Keep only last 10 records
      if (state.soilHistory.length > 10) {
        state.soilHistory = state.soilHistory.slice(0, 10);
      }
    },
    setSoilReport: (state, action: PayloadAction<SoilReport>) => {
      state.soilReport = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearSoilData: (state) => {
      state.currentSoilData = null;
      state.soilReport = null;
    },
  },
});

export const { setSoilData, setSoilReport, setLoading, clearSoilData } = soilSlice.actions;
export default soilSlice.reducer;
