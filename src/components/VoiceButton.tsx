import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoice } from '@/utils/voice';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStartListening?: () => void;
  onStopListening?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  onError,
  onStartListening,
  onStopListening,
  size = 'md',
  className,
  disabled = false
}) => {
  const { listen, stop, isListening, requestPermission } = useVoice();
  const [permissionGranted, setPermissionGranted] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  const handleVoiceToggle = async () => {
    if (disabled) return;

    if (!permissionGranted) {
      const granted = await requestPermission();
      setPermissionGranted(granted);
      if (!granted) {
        onError?.('Microphone permission required for voice features');
        return;
      }
    }

    if (isListening) {
      stop();
      onStopListening?.();
    } else {
      try {
        onStartListening?.();
        
        await listen(
          (transcript, isFinal) => {
            onTranscript?.(transcript, isFinal);
          },
          (error) => {
            onError?.(error);
            onStopListening?.();
          }
        );
      } catch (error) {
        console.error('Voice recognition failed:', error);
        onError?.(error instanceof Error ? error.message : 'Voice recognition failed');
        onStopListening?.();
      }
    }
  };

  return (
    <Button
      onClick={handleVoiceToggle}
      disabled={disabled}
      className={cn(
        'voice-button rounded-full',
        sizeClasses[size],
        isListening && 'active voice-pulse',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      variant="default"
    >
      {isListening ? (
        <MicOff className={iconSizes[size]} />
      ) : (
        <Mic className={iconSizes[size]} />
      )}
    </Button>
  );
};

export default VoiceButton;