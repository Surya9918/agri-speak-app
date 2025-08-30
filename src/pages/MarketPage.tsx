import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import VoiceButton from '@/components/VoiceButton';

const MarketPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Mock market data
  const marketPrices = [
    {
      crop: 'Tomatoes',
      price: 45,
      unit: 'kg',
      market: 'City Market',
      change: 5.2,
      history: [40, 42, 38, 45, 47, 43, 45]
    },
    {
      crop: 'Wheat',
      price: 28,
      unit: 'kg',
      market: 'Agricultural Mandi',
      change: -2.1,
      history: [30, 29, 31, 28, 27, 29, 28]
    },
    {
      crop: 'Corn',
      price: 22,
      unit: 'kg',
      market: 'Wholesale Market',
      change: 1.8,
      history: [20, 21, 22, 21, 23, 22, 22]
    }
  ];

  const filteredPrices = marketPrices.filter(item =>
    item.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVoiceSearch = (transcript: string, isFinal: boolean) => {
    if (isFinal) {
      setSearchQuery(transcript);
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
            {t('market.title')}
          </h1>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {/* Search Section */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              {t('market.searchCrop')}
            </h2>
            
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t('market.searchCrop')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <VoiceButton
                size="sm"
                onTranscript={handleVoiceSearch}
                onStartListening={() => setIsListening(true)}
                onStopListening={() => setIsListening(false)}
              />
            </div>

            {isListening && (
              <p className="text-voice-active text-sm">
                {t('voice.listening')}
              </p>
            )}
          </div>
        </Card>

        {/* Market Prices */}
        <div className="space-y-4">
          {filteredPrices.map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {item.crop}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.market}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      ₹{item.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{item.unit}
                      </span>
                    </div>
                    <div className={`flex items-center text-sm ${
                      item.change > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {item.change > 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(item.change)}%
                    </div>
                  </div>
                </div>

                {/* Price History Chart (Simple visualization) */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">
                    {t('market.priceHistory')}
                  </h4>
                  <div className="flex items-end space-x-1 h-20">
                    {item.history.map((price, i) => {
                      const maxPrice = Math.max(...item.history);
                      const height = (price / maxPrice) * 100;
                      return (
                        <div
                          key={i}
                          className="bg-primary flex-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                          style={{ height: `${height}%` }}
                          title={`Day ${i + 1}: ₹${price}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>7 days ago</span>
                    <span>Today</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-border">
                  <Button variant="outline" className="flex-1">
                    View Trends
                  </Button>
                  <Button className="flex-1">
                    Find Buyers
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredPrices.length === 0 && searchQuery && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No crops found for "{searchQuery}"
            </p>
          </Card>
        )}

        {/* Nearby Markets */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            {t('market.nearbyMarkets')}
          </h3>
          <div className="space-y-3">
            {['City Market (2.5 km)', 'Agricultural Mandi (5.1 km)', 'Wholesale Market (8.2 km)'].map((market, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-foreground">{market}</span>
                <Button variant="ghost" size="sm">
                  Directions
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarketPage;