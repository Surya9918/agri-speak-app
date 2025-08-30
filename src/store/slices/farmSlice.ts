import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CropSuggestion {
  id: string;
  name: string;
  icon: string;
  expectedYield: number;
  expectedProfit: number;
  sustainabilityRating: number;
  marketDemand: 'high' | 'medium' | 'low';
  waterRequirement: 'low' | 'medium' | 'high';
  soilMatch: number;
  seasonality: string;
}

interface GuidanceItem {
  id: string;
  type: 'irrigation' | 'pest' | 'fertilizer' | 'harvest' | 'general';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completed: boolean;
}

interface FarmState {
  cropSuggestions: CropSuggestion[];
  todaysTasks: GuidanceItem[];
  farmSummary: {
    cropsGrown: string[];
    totalArea: number;
    nextActions: string[];
  };
  isLoading: boolean;
  lastSync: string | null;
}

const initialState: FarmState = {
  cropSuggestions: [],
  todaysTasks: [],
  farmSummary: {
    cropsGrown: [],
    totalArea: 0,
    nextActions: [],
  },
  isLoading: false,
  lastSync: null,
};

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    setCropSuggestions: (state, action: PayloadAction<CropSuggestion[]>) => {
      state.cropSuggestions = action.payload;
    },
    setTodaysTasks: (state, action: PayloadAction<GuidanceItem[]>) => {
      state.todaysTasks = action.payload;
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.todaysTasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    updateFarmSummary: (state, action: PayloadAction<Partial<FarmState['farmSummary']>>) => {
      state.farmSummary = { ...state.farmSummary, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload;
    },
  },
});

export const {
  setCropSuggestions,
  setTodaysTasks,
  toggleTaskCompletion,
  updateFarmSummary,
  setLoading,
  setLastSync,
} = farmSlice.actions;
export default farmSlice.reducer;