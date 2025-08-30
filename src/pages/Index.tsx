import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { completeOnboarding, setUser } from '@/store/slices/authSlice';
import LanguageSelector from '@/components/LanguageSelector';
import WelcomeScreen from '@/components/WelcomeScreen';
import Dashboard from '@/components/Dashboard';
import { storage } from '@/utils/storage';

const Index = () => {
  const dispatch = useDispatch();
  const { hasCompletedOnboarding, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [currentStep, setCurrentStep] = useState<'language' | 'welcome' | 'dashboard'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboarding = async () => {
      const savedUser = await storage.getItem('userProfile') as any;
      const savedSettings = await storage.getItem('settings');
      
      if (savedUser && savedSettings && savedUser.id && savedUser.phone) {
        dispatch(setUser(savedUser));
        dispatch(completeOnboarding());
        setCurrentStep('dashboard');
      }
    };

    checkOnboarding();
  }, [dispatch]);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentStep('welcome');
  };

  const handleWelcomeContinue = () => {
    // For now, skip auth and go directly to dashboard
    // In a real app, this would go to login/registration
    const mockUser = {
      id: 'demo-user',
      phone: '+1234567890',
      name: 'Demo Farmer',
      location: 'Demo Farm, Agriculture Valley',
      farmSize: '10 acres',
      crops: ['wheat', 'corn', 'tomatoes']
    };

    dispatch(setUser(mockUser));
    dispatch(completeOnboarding());
    
    // Save to storage
    storage.setItem('userProfile', mockUser);
    storage.setItem('settings', { language: selectedLanguage });
    
    setCurrentStep('dashboard');
  };

  if (currentStep === 'language') {
    return (
      <LanguageSelector
        onLanguageSelect={handleLanguageSelect}
        selectedLanguage={selectedLanguage}
      />
    );
  }

  if (currentStep === 'welcome') {
    return <WelcomeScreen onContinue={handleWelcomeContinue} />;
  }

  return <Dashboard />;
};

export default Index;
