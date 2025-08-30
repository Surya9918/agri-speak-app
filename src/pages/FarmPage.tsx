import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Home, MapPin, Calendar, TrendingUp, Sprout, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RootState } from '@/store/store';

const FarmPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock farm data
  const farmData = {
    totalArea: 25,
    cultivatedArea: 22,
    cropsGrown: [
      { name: 'Tomatoes', area: 8, status: 'flowering', health: 85 },
      { name: 'Wheat', area: 10, status: 'growing', health: 92 },
      { name: 'Corn', area: 4, status: 'harvesting', health: 78 }
    ],
    soilHealth: 85,
    lastUpdate: new Date().toLocaleDateString(),
    nextActions: [
      'Water tomato field in section B',
      'Apply fertilizer to wheat crop',
      'Schedule pest inspection for corn'
    ],
    seasonStats: {
      revenue: 245000,
      expenses: 85000,
      profit: 160000
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flowering': return 'text-accent';
      case 'growing': return 'text-success';
      case 'harvesting': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-warning';
    return 'text-destructive';
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
            {t('dashboard.myFarm')}
          </h1>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {/* Farm Overview */}
        <Card className="p-6 bg-gradient-primary text-primary-foreground">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">{user?.name}'s Farm</h2>
                <div className="flex items-center space-x-2 opacity-90">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{farmData.totalArea}</div>
                <div className="text-sm opacity-90">Total Acres</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{farmData.cultivatedArea}</div>
                <div className="text-sm opacity-90">Cultivated</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Crops Overview */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Sprout className="w-5 h-5 mr-2 text-success" />
              Current Crops
            </h3>

            <div className="space-y-4">
              {farmData.cropsGrown.map((crop, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{crop.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {crop.area} acres • 
                        <span className={`ml-1 ${getStatusColor(crop.status)}`}>
                          {crop.status}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getHealthColor(crop.health)}`}>
                        {crop.health}%
                      </div>
                      <div className="text-xs text-muted-foreground">Health</div>
                    </div>
                  </div>
                  <Progress value={crop.health} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Soil Health Summary */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-primary" />
              Soil Health Summary
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${getHealthColor(farmData.soilHealth)}`}>
                  {farmData.soilHealth}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall soil health
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/soil')}
              >
                View Details
              </Button>
            </div>
            
            <Progress value={farmData.soilHealth} className="h-3" />
          </div>
        </Card>

        {/* Season Statistics */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-accent" />
              This Season's Performance
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-xl font-bold text-success">
                  ₹{farmData.seasonStats.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Revenue</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-xl font-bold text-warning">
                  ₹{farmData.seasonStats.expenses.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Expenses</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-xl font-bold text-primary">
                  ₹{farmData.seasonStats.profit.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Profit</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Actions */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-warning" />
              Next Best Actions
            </h3>

            <div className="space-y-3">
              {farmData.nextActions.map((action, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-card border border-border rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground flex-1">{action}</p>
                  <Button size="sm" variant="ghost">
                    Schedule
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="p-6 h-auto flex-col space-y-2"
            onClick={() => navigate('/crops')}
          >
            <Sprout className="w-6 h-6 text-success" />
            <span>Plan Crops</span>
          </Button>
          <Button 
            variant="outline" 
            className="p-6 h-auto flex-col space-y-2"
            onClick={() => navigate('/market')}
          >
            <TrendingUp className="w-6 h-6 text-accent" />
            <span>Market Analysis</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FarmPage;