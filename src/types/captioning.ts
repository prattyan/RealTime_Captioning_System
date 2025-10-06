export interface Caption {
  id: string;
  sessionId: string;
  originalText: string;
  simplifiedText: string;
  language: string;
  confidenceScore: number;
  timestamp: Date;
  durationMs: number;
  speakerId?: string;
}

export interface CaptionSession {
  id: string;
  title: string;
  language: string;
  status: 'active' | 'paused' | 'completed';
  settings: SessionSettings;
  createdAt: Date;
  updatedAt: Date;
  endedAt?: Date;
}

export interface SessionSettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  contrastMode: 'normal' | 'high' | 'maximum';
  simplificationLevel: 'none' | 'basic' | 'advanced';
  showConfidence: boolean;
  autoScroll: boolean;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  enabled: boolean;
  simplificationAvailable: boolean;
}

export interface UserPreferences {
  preferredLanguages: string[];
  fontSize: SessionSettings['fontSize'];
  contrastMode: SessionSettings['contrastMode'];
  simplificationLevel: SessionSettings['simplificationLevel'];
  showConfidence: boolean;
  autoScroll: boolean;
  saveHistory: boolean;
}
