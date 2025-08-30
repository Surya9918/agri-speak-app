interface VoiceSettings {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

class VoiceManager {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private settings: VoiceSettings = {
    language: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
    }

    if (this.recognition) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.settings.language;
    }
  }

  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  speak(text: string, options?: Partial<VoiceSettings>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const settings = { ...this.settings, ...options };

      utterance.lang = this.getVoiceLanguage(settings.language);
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);

      this.synthesis.speak(utterance);
    });
  }

  listen(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        const error = 'Speech recognition not supported';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      if (this.isListening) {
        this.stop();
      }

      this.recognition.onresult = (event) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          transcript += result[0].transcript;
          if (result.isFinal) {
            isFinal = true;
          }
        }

        onResult(transcript, isFinal);

        if (isFinal) {
          resolve(transcript);
          this.isListening = false;
        }
      };

      this.recognition.onerror = (event) => {
        const error = `Speech recognition error: ${event.error}`;
        onError?.(error);
        reject(new Error(error));
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
    });
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.recognition) {
      this.recognition.lang = this.settings.language;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  getAvailableLanguages(): string[] {
    const voices = this.synthesis.getVoices();
    const languages = Array.from(new Set(voices.map(voice => voice.lang)));
    return languages;
  }

  private getVoiceLanguage(language: string): string {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN'
    };
    return languageMap[language] || 'en-US';
  }

  async testVoice(language: string): Promise<void> {
    const testPhrases: Record<string, string> = {
      'en': 'Welcome to Smart Agriculture',
      'hi': 'स्मार्ट कृषि में आपका स्वागत है',
      'ta': 'ஸ்மார்ட் வேளாண்மைக்கு வரவேற்கிறோம்',
      'te': 'స్మార్ట్ వ్యవసాయానికి స్వాగతం'
    };

    const phrase = testPhrases[language] || testPhrases['en'];
    await this.speak(phrase, { language });
  }
}

export const voiceManager = new VoiceManager();

// Hook for React components
export const useVoice = () => {
  const speak = (text: string, options?: Partial<VoiceSettings>) => {
    return voiceManager.speak(text, options);
  };

  const listen = (
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void
  ) => {
    return voiceManager.listen(onResult, onError);
  };

  const stop = () => {
    voiceManager.stop();
  };

  const isListening = voiceManager.getIsListening();

  return {
    speak,
    listen,
    stop,
    isListening,
    updateSettings: voiceManager.updateSettings.bind(voiceManager),
    testVoice: voiceManager.testVoice.bind(voiceManager),
    requestPermission: voiceManager.requestMicrophonePermission.bind(voiceManager)
  };
};