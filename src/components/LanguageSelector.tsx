import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, Check } from 'lucide-react';
import { setLanguage } from '@/store/slices/settingsSlice';
import { useVoice } from '@/utils/voice';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
  onLanguageSelect: (language: string) => void;
  selectedLanguage?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelect,
  selectedLanguage = 'en'
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { speak, testVoice } = useVoice();
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);

  const handleLanguageSelect = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      dispatch(setLanguage(language));
      onLanguageSelect(language);
      
      // Speak confirmation in selected language
      await speak(t('onboarding.languagePreview'), { language });
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const handleVoicePreview = async (language: string) => {
    if (playingPreview === language) return;
    
    setPlayingPreview(language);
    try {
      await testVoice(language);
    } catch (error) {
      console.error('Voice preview failed:', error);
    } finally {
      setPlayingPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            {t('onboarding.languageSelection')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('onboarding.languagePreview')}
          </p>
        </div>

        {/* Language Options */}
        <div className="space-y-4">
          {languages.map((language) => (
            <Card
              key={language.code}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedLanguage === language.code
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary-glow'
                  : 'bg-card hover:bg-secondary'
              }`}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{language.flag}</span>
                  <div>
                    <h3 className="text-xl font-semibold">{language.nativeName}</h3>
                    <p className="text-sm opacity-80">{language.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Voice Preview Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVoicePreview(language.code);
                    }}
                    className={`voice-button ${
                      playingPreview === language.code ? 'active' : ''
                    }`}
                    disabled={playingPreview === language.code}
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>

                  {/* Selected Indicator */}
                  {selectedLanguage === language.code && (
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          className="w-full text-lg py-6 bg-gradient-primary hover:scale-105 transition-transform"
          onClick={() => handleLanguageSelect(selectedLanguage)}
        >
          {t('common.continue')}
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelector;