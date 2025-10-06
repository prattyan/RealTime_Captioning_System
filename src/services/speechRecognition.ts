import { Caption } from '../types/captioning';

export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-US';
  private onCaptionCallback?: (caption: Omit<Caption, 'id' | 'sessionId'>) => void;

  private languageMap: Record<string, string> = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'bn': 'bn-IN',
    'gu': 'gu-IN',
    'ml': 'ml-IN',
    'kn': 'kn-IN',
    'mr': 'mr-IN',
    'pa': 'pa-IN'
  };

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResult = results[results.length - 1];

      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript;
        const confidence = lastResult[0].confidence;

        if (this.onCaptionCallback) {
          this.onCaptionCallback({
            originalText: transcript,
            simplifiedText: transcript,
            language: this.currentLanguage.split('-')[0],
            confidenceScore: confidence,
            timestamp: new Date(),
            durationMs: 0
          });
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        return;
      }
      this.isListening = false;
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.recognition.start();
      }
    };
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public start(language: string, onCaption: (caption: Omit<Caption, 'id' | 'sessionId'>) => void) {
    if (!this.recognition || this.isListening) return;

    this.currentLanguage = this.languageMap[language] || 'en-US';
    this.recognition.lang = this.currentLanguage;
    this.onCaptionCallback = onCaption;

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }

  public stop() {
    if (!this.recognition || !this.isListening) return;

    this.isListening = false;
    this.recognition.stop();
  }

  public pause() {
    if (!this.recognition || !this.isListening) return;

    this.recognition.stop();
  }

  public resume() {
    if (!this.recognition || !this.isListening) return;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to resume speech recognition:', error);
    }
  }

  public changeLanguage(language: string) {
    const wasListening = this.isListening;

    if (wasListening) {
      this.stop();
    }

    this.currentLanguage = this.languageMap[language] || 'en-US';

    if (wasListening && this.onCaptionCallback) {
      this.start(language, this.onCaptionCallback);
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
