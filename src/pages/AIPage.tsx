import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Brain, MessageCircle, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VoiceButton from '@/components/VoiceButton';
import { useVoice } from '@/utils/voice';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { speak } = useVoice();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI farming assistant. Ask me anything about your crops, soil, weather, or farming techniques. You can speak or type your questions.',
      timestamp: new Date()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mockResponses = [
    "Based on your soil data, I recommend increasing phosphorus levels for better tomato growth.",
    "The weather forecast shows rainfall in 2 days. Consider adjusting your irrigation schedule.",
    "For pest control in corn, try companion planting with marigolds as a natural deterrent.",
    "Your wheat crop is in the optimal growth phase. Continue current fertilization schedule.",
    "Market prices for tomatoes are expected to rise next week due to seasonal demand."
  ];

  const handleVoiceInput = async (transcript: string, isFinal: boolean) => {
    if (isFinal && transcript.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: transcript,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsProcessing(true);

      // Simulate AI processing
      setTimeout(() => {
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: randomResponse,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);

        // Speak the AI response
        speak(randomResponse);
      }, 1500);
    }
  };

  const speakMessage = async (content: string) => {
    try {
      await speak(content);
    } catch (error) {
      console.error('Failed to speak message:', error);
    }
  };

  const frequentQuestions = [
    "What should I plant this season?",
    "How do I improve soil health?",
    "When should I water my crops?",
    "What are current market prices?",
    "How do I control pests naturally?"
  ];

  const handleQuickQuestion = (question: string) => {
    handleVoiceInput(question, true);
  };

  return (
    <div className="min-h-screen bg-gradient-earth flex flex-col">
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
            {t('dashboard.askAI')}
          </h1>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && (
                    <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.type === 'ai' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakMessage(message.content)}
                          className="p-1 h-auto"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-card border border-border px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t('voice.processing')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Input Section */}
      <div className="px-6 pb-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Main Voice Button */}
          <Card className="p-6 text-center">
            <div className="space-y-4">
              <VoiceButton
                size="lg"
                onTranscript={handleVoiceInput}
                onStartListening={() => setIsListening(true)}
                onStopListening={() => setIsListening(false)}
                className="mx-auto"
                disabled={isProcessing}
              />
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {isListening ? t('voice.listening') : t('voice.tapToSpeak')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('voice.askQuestion')}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Questions */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Frequently Asked Questions
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {frequentQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="justify-start text-left h-auto p-3 whitespace-normal"
                  disabled={isProcessing}
                >
                  <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {question}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIPage;