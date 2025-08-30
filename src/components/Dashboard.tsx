import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  TrendingUp, 
  Brain, 
  MapPin, 
  Wifi, 
  WifiOff,
  TestTube,
  BookOpen,
  Home,
  Mic
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/store/store';

interface DashboardTile {
  id: string;
  titleKey: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  description?: string;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOnline } = useSelector((state: RootState) => state.settings);
  const { user } = useSelector((state: RootState) => state.auth);

  const tiles: DashboardTile[] = [
    {
      id: 'soil',
      titleKey: 'dashboard.mySoil',
      icon: <TestTube className="farm-tile-icon text-primary" />,
      route: '/soil',
      color: 'bg-primary/10 border-primary/20',
      description: 'Analyze soil health'
    },
    {
      id: 'crops',
      titleKey: 'dashboard.bestCrops',
      icon: <Sprout className="farm-tile-icon text-success" />,
      route: '/crops',
      color: 'bg-success/10 border-success/20',
      description: 'AI crop recommendations'
    },
    {
      id: 'market',
      titleKey: 'dashboard.marketPrices',
      icon: <TrendingUp className="farm-tile-icon text-accent" />,
      route: '/market',
      color: 'bg-accent/10 border-accent/20',
      description: 'Live market prices'
    },
    {
      id: 'guidance',
      titleKey: 'dashboard.guidance',
      icon: <BookOpen className="farm-tile-icon text-warning" />,
      route: '/guidance',
      color: 'bg-warning/10 border-warning/20',
      description: "Today's farming tasks"
    },
    {
      id: 'ai',
      titleKey: 'dashboard.askAI',
      icon: <Mic className="farm-tile-icon text-voice-active" />,
      route: '/ai',
      color: 'bg-voice-active/10 border-voice-active/20',
      description: 'Voice-powered assistant'
    },
    {
      id: 'farm',
      titleKey: 'dashboard.myFarm',
      icon: <Home className="farm-tile-icon text-secondary-foreground" />,
      route: '/farm',
      color: 'bg-secondary/10 border-secondary/20',
      description: 'Farm overview'
    }
  ];

  const handleTileClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {user?.location || 'Location not set'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant={isOnline ? "default" : "secondary"}
                className={isOnline ? "status-online" : "status-offline"}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    {t('common.online')}
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    {t('common.offline')}
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            {t('common.welcome')}, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('dashboard.title')}
          </p>
        </div>
      </div>

      {/* Dashboard Tiles */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {tiles.map((tile, index) => (
              <Card
                key={tile.id}
                className={`farm-tile ${tile.color} cursor-pointer group hover:scale-105 transition-all duration-300`}
                onClick={() => handleTileClick(tile.route)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="farm-tile grow-in">
                  <div className="mb-4">
                    {tile.icon}
                  </div>
                  <h3 className="farm-tile-title">
                    {t(tile.titleKey)}
                  </h3>
                  <p className="farm-tile-subtitle">
                    {tile.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 bg-gradient-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Farm Quick Stats</h3>
                <p className="opacity-90">Last updated: Today</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm opacity-90">Soil Health</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Spacing for Navigation */}
      <div className="h-20" />
    </div>
  );
};

export default Dashboard;