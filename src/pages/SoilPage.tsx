import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, TestTube, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import VoiceButton from '@/components/VoiceButton';

const SoilPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  // Mock soil data
  const soilData = {
    ph: 6.8,
    nitrogen: 85,
    phosphorus: 72,
    potassium: 90,
    moisture: 68,
    overall: 'good' as const
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getOverallColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-success';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-6 py-4 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            {t('soil.title')}
          </h1>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {/* Voice Input Section */}
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <TestTube className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-lg font-semibold">Enter Soil Data</h2>
            <p className="text-sm text-muted-foreground">
              Use voice to input your soil test results
            </p>
            <VoiceButton
              size="lg"
              onTranscript={(text, isFinal) => {
                console.log('Soil data transcript:', text);
              }}
              onStartListening={() => setIsListening(true)}
              onStopListening={() => setIsListening(false)}
              className="mx-auto"
            />
            {isListening && (
              <p className="text-voice-active font-medium">
                {t('voice.listening')}
              </p>
            )}
          </div>
        </Card>

        {/* Soil Report Card */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Soil Health Report
              </h3>
              <div className={`text-3xl font-bold ${getOverallColor(soilData.overall)}`}>
                {t(`soil.${soilData.overall}`)}
              </div>
            </div>

            {/* Soil Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('soil.ph')}</span>
                  <span className={`font-bold ${getHealthColor(soilData.ph * 10)}`}>
                    {soilData.ph}
                  </span>
                </div>
                <Progress value={soilData.ph * 10} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('soil.nitrogen')}</span>
                  <span className={`font-bold ${getHealthColor(soilData.nitrogen)}`}>
                    {soilData.nitrogen}%
                  </span>
                </div>
                <Progress value={soilData.nitrogen} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('soil.phosphorus')}</span>
                  <span className={`font-bold ${getHealthColor(soilData.phosphorus)}`}>
                    {soilData.phosphorus}%
                  </span>
                </div>
                <Progress value={soilData.phosphorus} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('soil.potassium')}</span>
                  <span className={`font-bold ${getHealthColor(soilData.potassium)}`}>
                    {soilData.potassium}%
                  </span>
                </div>
                <Progress value={soilData.potassium} className="h-2" />
              </div>
            </div>

            {/* Moisture */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-3">
                <Droplets className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{t('soil.moisture')}</span>
                    <span className={`font-bold ${getHealthColor(soilData.moisture)}`}>
                      {soilData.moisture}%
                    </span>
                  </div>
                  <Progress value={soilData.moisture} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('soil.recommendations')}</h3>
          <div className="space-y-3">
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm text-success-foreground">
                ✓ Good nitrogen levels - continue current fertilization
              </p>
            </div>
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                ⚠ Consider adding phosphorus supplement
              </p>
            </div>
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm text-accent-foreground">
                💧 Soil moisture is optimal for current season
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SoilPage;