import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Leaf, Mic, Smartphone, TrendingUp } from 'lucide-react';
import { useVoice } from '@/utils/voice';
import heroImage from '@/assets/hero-agriculture.jpg';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const { t } = useTranslation();
  const { speak, requestPermission } = useVoice();
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Auto-play welcome message
    const playWelcome = async () => {
      try {
        await speak(t('onboarding.voiceIntro'));
      } catch (error) {
        console.error('Failed to play welcome message:', error);
      }
    };

    // Delay to ensure translation is loaded
    setTimeout(playWelcome, 1000);
  }, [speak, t]);

  const handleContinue = async () => {
    if (!permissionGranted) {
      const granted = await requestPermission();
      setPermissionGranted(granted);
      if (!granted) {
        // Show permission explanation
        return;
      }
    }
    onContinue();
  };

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-success" />,
      title: "Smart Soil Analysis",
      description: "AI-powered soil health monitoring"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-accent" />,
      title: "Market Intelligence",
      description: "Real-time crop price tracking"
    },
    {
      icon: <Mic className="w-8 h-8 text-voice-active" />,
      title: "Voice Assistant",
      description: "Ask questions in your language"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "Offline Access",
      description: "Works without internet"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 px-6 pt-20 pb-16 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 grow-in">
              <h1 className="text-5xl md:text-6xl font-bold">
                {t('onboarding.welcomeTitle')}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                {t('onboarding.welcomeSubtitle')}
              </p>
            </div>

            {/* App Logo/Icon */}
            <div className="flex justify-center slide-up">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Leaf className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-16 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16 text-center">
        <div className="max-w-md mx-auto space-y-6">
          {!permissionGranted && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                We need microphone access for voice features. This helps you interact with the app hands-free.
              </p>
            </div>
          )}
          
          <Button
            onClick={handleContinue}
            className="w-full text-lg py-6 bg-gradient-primary hover:scale-105 transition-transform"
          >
            {permissionGranted ? t('common.continue') : 'Grant Access & Continue'}
          </Button>

          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;