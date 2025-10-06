import { Mic, MicOff, Pause, Play, Settings, Download, Languages, Type, Eye, Volume2 } from 'lucide-react';
import { SessionSettings } from '../types/captioning';
import { SUPPORTED_LANGUAGES } from '../data/languages';

interface ControlPanelProps {
  isListening: boolean;
  isPaused: boolean;
  currentLanguage: string;
  settings: SessionSettings;
  showOriginal: boolean;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onLanguageChange: (language: string) => void;
  onSettingsChange: (settings: Partial<SessionSettings>) => void;
  onToggleOriginal: () => void;
  onExport: () => void;
  showSettings: boolean;
  onToggleSettings: () => void;
}

export function ControlPanel({
  isListening,
  isPaused,
  currentLanguage,
  settings,
  showOriginal,
  onStart,
  onStop,
  onPause,
  onResume,
  onLanguageChange,
  onSettingsChange,
  onToggleOriginal,
  onExport,
  showSettings,
  onToggleSettings
}: ControlPanelProps) {
  return (
    <div className="bg-gray-900 border-t border-gray-800">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            {!isListening ? (
              <button
                onClick={onStart}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                aria-label="Start captioning"
              >
                <Mic size={20} />
                Start Captioning
              </button>
            ) : (
              <>
                <button
                  onClick={onStop}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  aria-label="Stop captioning"
                >
                  <MicOff size={20} />
                  Stop
                </button>
                <button
                  onClick={isPaused ? onResume : onPause}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  aria-label={isPaused ? 'Resume captioning' : 'Pause captioning'}
                >
                  {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>

            <button
              onClick={onToggleOriginal}
              className={`p-3 rounded-lg transition-colors ${
                showOriginal
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-label={showOriginal ? 'Show simplified text' : 'Show original text'}
              title={showOriginal ? 'Show simplified text' : 'Show original text'}
            >
              <Eye size={20} />
            </button>

            <button
              onClick={onToggleSettings}
              className={`p-3 rounded-lg transition-colors ${
                showSettings
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-label="Toggle settings"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={onExport}
              className="p-3 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Export captions"
              title="Export captions"
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <Type size={16} />
                  Font Size
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => onSettingsChange({ fontSize: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <Eye size={16} />
                  Contrast Mode
                </label>
                <select
                  value={settings.contrastMode}
                  onChange={(e) => onSettingsChange({ contrastMode: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Contrast</option>
                  <option value="maximum">Maximum Contrast</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <Languages size={16} />
                  Simplification
                </label>
                <select
                  value={settings.simplificationLevel}
                  onChange={(e) => onSettingsChange({ simplificationLevel: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="basic">Basic</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <Volume2 size={16} />
                  Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={settings.showConfidence}
                      onChange={(e) => onSettingsChange({ showConfidence: e.target.checked })}
                      className="rounded"
                    />
                    Show Confidence
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={settings.autoScroll}
                      onChange={(e) => onSettingsChange({ autoScroll: e.target.checked })}
                      className="rounded"
                    />
                    Auto Scroll
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isListening && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 text-sm text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live captioning active</span>
          </div>
        </div>
      )}
    </div>
  );
}
