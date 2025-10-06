import { useState, useCallback } from 'react';
import { CaptionDisplay } from './components/CaptionDisplay';
import { ControlPanel } from './components/ControlPanel';
import { speechRecognitionService } from './services/speechRecognition';
import { textSimplificationService } from './services/textSimplification';
import { Caption, SessionSettings } from './types/captioning';
import { DEFAULT_LANGUAGE } from './data/languages';
import { Volume2 } from 'lucide-react';

function App() {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SessionSettings>({
    fontSize: 'medium',
    contrastMode: 'normal',
    simplificationLevel: 'basic',
    showConfidence: true,
    autoScroll: true
  });

  const handleNewCaption = useCallback((captionData: Omit<Caption, 'id' | 'sessionId'>) => {
    const simplifiedText = textSimplificationService.simplifyText(
      captionData.originalText,
      settings.simplificationLevel,
      currentLanguage
    );

    const newCaption: Caption = {
      id: crypto.randomUUID(),
      sessionId: 'current-session',
      ...captionData,
      simplifiedText
    };

    setCaptions(prev => [...prev, newCaption]);
  }, [settings.simplificationLevel, currentLanguage]);

  const handleStart = () => {
    if (!speechRecognitionService.isSupported()) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    speechRecognitionService.start(currentLanguage, handleNewCaption);
    setIsListening(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    speechRecognitionService.stop();
    setIsListening(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    speechRecognitionService.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    speechRecognitionService.resume();
    setIsPaused(false);
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    if (isListening) {
      speechRecognitionService.changeLanguage(language);
    }
  };

  const handleSettingsChange = (newSettings: Partial<SessionSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleExport = () => {
    const exportData = captions.map(caption => ({
      timestamp: caption.timestamp.toISOString(),
      original: caption.originalText,
      simplified: caption.simplifiedText,
      language: caption.language,
      confidence: caption.confidenceScore
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `captions-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Volume2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Real-Time Captioning System
              </h1>
              <p className="text-sm text-gray-400">
                Accessible multilingual speech-to-text for Deaf and hard-of-hearing users
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">
              {captions.length} caption{captions.length !== 1 ? 's' : ''}
            </p>
            {isListening && !isPaused && (
              <p className="text-xs text-green-400 font-semibold">
                LIVE
              </p>
            )}
          </div>
        </div>
      </header>

      <CaptionDisplay
        captions={captions}
        settings={settings}
        showOriginal={showOriginal}
      />

      <ControlPanel
        isListening={isListening}
        isPaused={isPaused}
        currentLanguage={currentLanguage}
        settings={settings}
        showOriginal={showOriginal}
        onStart={handleStart}
        onStop={handleStop}
        onPause={handlePause}
        onResume={handleResume}
        onLanguageChange={handleLanguageChange}
        onSettingsChange={handleSettingsChange}
        onToggleOriginal={() => setShowOriginal(prev => !prev)}
        onExport={handleExport}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(prev => !prev)}
      />
    </div>
  );
}

export default App;
