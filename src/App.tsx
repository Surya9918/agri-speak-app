import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from '@/store/store';
import '@/i18n';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SoilPage from "./pages/SoilPage";
import CropsPage from "./pages/CropsPage";
import MarketPage from "./pages/MarketPage";
import GuidancePage from "./pages/GuidancePage";
import AIPage from "./pages/AIPage";
import FarmPage from "./pages/FarmPage";
import { setOnlineStatus } from '@/store/slices/settingsSlice';

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      store.dispatch(setOnlineStatus(true));
    };

    const handleOffline = () => {
      store.dispatch(setOnlineStatus(false));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/soil" element={<SoilPage />} />
        <Route path="/crops" element={<CropsPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/guidance" element={<GuidancePage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/farm" element={<FarmPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
