import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Sprout, TrendingUp, Droplets, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CropsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'profit' | 'yield' | 'sustainability'>('profit');

  // Mock crop suggestions
  const cropSuggestions = [
    {
      id: '1',
      name: 'Tomatoes',
      icon: '🍅',
      expectedYield: 25,
      expectedProfit: 85000,
      sustainabilityRating: 4,
      marketDemand: 'high' as const,
      waterRequirement: 'medium' as const,
      soilMatch: 92,
      seasonality: 'Summer'
    },
    {
      id: '2',
      name: 'Wheat',
      icon: '🌾',
      expectedYield: 40,
      expectedProfit: 45000,
      sustainabilityRating: 5,
      marketDemand: 'high' as const,
      waterRequirement: 'low' as const,
      soilMatch: 88,
      seasonality: 'Winter'
    },
    {
      id: '3',
      name: 'Corn',
      icon: '🌽',
      expectedYield: 60,
      expectedProfit: 65000,
      sustainabilityRating: 3,
      marketDemand: 'medium' as const,
      waterRequirement: 'high' as const,
      soilMatch: 85,
      seasonality: 'Summer'
    }
  ];

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getWaterColor = (requirement: string) => {
    switch (requirement) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
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
            {t('crops.title')}
          </h1>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {/* Sort Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            {(['profit', 'yield', 'sustainability'] as const).map((option) => (
              <Button
                key={option}
                variant={sortBy === option ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy(option)}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>

        {/* Crop Cards */}
        <div className="space-y-4">
          {cropSuggestions.map((crop) => (
            <Card key={crop.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {crop.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {crop.seasonality} crop
                      </p>
                    </div>
                  </div>
                  <Badge className={getDemandColor(crop.marketDemand)}>
                    {t(`crops.${crop.marketDemand}`)} demand
                  </Badge>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">
                      ₹{crop.expectedProfit.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('crops.expectedProfit')}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <Sprout className="w-5 h-5 text-success mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">
                      {crop.expectedYield} tons
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('crops.expectedYield')}
                    </div>
                  </div>

                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="flex justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < crop.sustainabilityRating
                              ? 'text-accent fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('crops.sustainability')}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Droplets className={`w-4 h-4 ${getWaterColor(crop.waterRequirement)}`} />
                    <span className="text-sm">
                      {t(`crops.${crop.waterRequirement}`)} {t('crops.waterUse')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {crop.soilMatch}% {t('crops.soilMatch')}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full mt-4" variant="outline">
                  View Details & Plant
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropsPage;