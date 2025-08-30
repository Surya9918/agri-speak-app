import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  market: string;
  date: string;
  change?: number; // percentage change from previous day
}

interface PriceHistory {
  crop: string;
  prices: { date: string; price: number }[];
}

interface MarketState {
  currentPrices: MarketPrice[];
  priceHistory: PriceHistory[];
  nearbyMarkets: string[];
  searchQuery: string;
  isLoading: boolean;
  lastUpdate: string | null;
}

const initialState: MarketState = {
  currentPrices: [],
  priceHistory: [],
  nearbyMarkets: [],
  searchQuery: '',
  isLoading: false,
  lastUpdate: null,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setCurrentPrices: (state, action: PayloadAction<MarketPrice[]>) => {
      state.currentPrices = action.payload;
      state.lastUpdate = new Date().toISOString();
    },
    setPriceHistory: (state, action: PayloadAction<PriceHistory[]>) => {
      state.priceHistory = action.payload;
    },
    setNearbyMarkets: (state, action: PayloadAction<string[]>) => {
      state.nearbyMarkets = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addPriceToHistory: (state, action: PayloadAction<{ crop: string; price: number; date: string }>) => {
      const { crop, price, date } = action.payload;
      const existingHistory = state.priceHistory.find(h => h.crop === crop);
      if (existingHistory) {
        existingHistory.prices.unshift({ date, price });
        // Keep only last 7 days
        existingHistory.prices = existingHistory.prices.slice(0, 7);
      } else {
        state.priceHistory.push({
          crop,
          prices: [{ date, price }]
        });
      }
    },
  },
});

export const {
  setCurrentPrices,
  setPriceHistory,
  setNearbyMarkets,
  setSearchQuery,
  setLoading,
  addPriceToHistory,
} = marketSlice.actions;
export default marketSlice.reducer;
