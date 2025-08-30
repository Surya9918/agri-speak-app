import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Droplets, Bug, Sprout, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GuidancePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock guidance data
  const todaysTasks = [
    {
      id: '1',
      type: 'irrigation' as const,
      title: 'Water tomato field',
      description: 'Field 2 needs watering - soil moisture below optimal',
      priority: 'high' as const,
      completed: false,
      dueTime: '08:00 AM'
    },
    {
      id: '2',
      type: 'pest' as const,
      title: 'Check for aphids',
      description: 'Weekly pest inspection due for corn field',
      priority: 'medium' as const,
      completed: true,
      dueTime: '10:00 AM'
    },
    {
      id: '3',
      type: 'fertilizer' as const,
      title: 'Apply nitrogen fertilizer',
      description: 'Wheat field requires nitrogen boost for growth phase',
      priority: 'medium' as const,
      completed: false,
      dueTime: '02:00 PM'
    }
  ];

  const guidanceSections = [
    {
      title: 'Soil Care',
      icon: <Sprout className="w-6 h-6 text-success" />,
      tips: [
        'Test pH levels monthly',
        'Add organic compost weekly',
        'Monitor moisture levels daily'
      ]
    },
    {
      title: 'Water Management',
      icon: <Droplets className="w-6 h-6 text-primary" />,
      tips: [
        'Water early morning or evening',
        'Use drip irrigation for efficiency',
        'Check weather forecast before watering'
      ]
    },
    {
      title: 'Pest Control',
      icon: <Bug className="w-6 h-6 text-warning" />,
      tips: [
        'Inspect crops weekly',
        'Use beneficial insects',
        'Apply organic pesticides when needed'
      ]
    }
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'irrigation': return <Droplets className="w-5 h-5 text-primary" />;
      case 'pest': return <Bug className="w-5 h-5 text-warning" />;
      case 'fertilizer': return <Sprout className="w-5 h-5 text-success" />;
      default: return <Calendar className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
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
            {t('guidance.title')}
          </h1>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {/* Today's Tasks */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              {t('guidance.todaysTasks')}
            </h2>

            <div className="space-y-3">
              {todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all ${
                    task.completed
                      ? 'bg-success/10 border-success/20'
                      : 'bg-card border-border hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        getTaskIcon(task.type)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium ${
                          task.completed ? 'text-success line-through' : 'text-foreground'
                        }`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {task.dueTime}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm ${
                        task.completed ? 'text-success/70' : 'text-muted-foreground'
                      }`}>
                        {task.description}
                      </p>
                    </div>

                    {!task.completed && (
                      <Button size="sm" className="ml-3">
                        Mark Done
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Guidance Sections */}
        <div className="space-y-4">
          {guidanceSections.map((section, index) => (
            <Card key={index} className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  {section.icon}
                  <span className="ml-2">{section.title}</span>
                </h3>
                
                <div className="space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Weather Alert */}
        <Card className="p-6 bg-warning/10 border-warning/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-warning-foreground mb-2">
                Weather Alert
              </h3>
              <p className="text-sm text-warning-foreground">
                Heavy rainfall expected tomorrow. Consider postponing fertilizer application and ensure proper drainage.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
            <Calendar className="w-6 h-6 text-primary" />
            <span>View Calendar</span>
          </Button>
          <Button variant="outline" className="p-6 h-auto flex-col space-y-2">
            <Sprout className="w-6 h-6 text-success" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuidancePage;