import { useEffect, useRef } from 'react';
import { Caption, SessionSettings } from '../types/captioning';

interface CaptionDisplayProps {
  captions: Caption[];
  settings: SessionSettings;
  showOriginal: boolean;
}

export function CaptionDisplay({ captions, settings, showOriginal }: CaptionDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settings.autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [captions, settings.autoScroll]);

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-base';
      case 'medium': return 'text-lg';
      case 'large': return 'text-xl';
      case 'xlarge': return 'text-2xl';
      default: return 'text-lg';
    }
  };

  const getContrastClass = () => {
    switch (settings.contrastMode) {
      case 'normal': return 'bg-black/80 text-white';
      case 'high': return 'bg-black text-yellow-300';
      case 'maximum': return 'bg-black text-white border-2 border-white';
      default: return 'bg-black/80 text-white';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-400';
    if (score >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto p-6 space-y-4 ${getContrastClass()}`}
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-relevant="additions"
    >
      {captions.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-xl">
            Start speaking to see captions appear here...
          </p>
        </div>
      ) : (
        captions.map((caption) => (
          <div
            key={caption.id}
            className={`p-4 rounded-lg transition-all duration-200 ${
              settings.contrastMode === 'maximum' ? 'border-2 border-white' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-gray-400">
                {formatTime(caption.timestamp)}
              </span>
              {settings.showConfidence && (
                <span className={`text-xs font-mono ${getConfidenceColor(caption.confidenceScore)}`}>
                  {(caption.confidenceScore * 100).toFixed(0)}%
                </span>
              )}
            </div>

            <p
              className={`${getFontSizeClass()} leading-relaxed font-medium`}
              lang={caption.language}
            >
              {showOriginal ? caption.originalText : caption.simplifiedText}
            </p>

            {showOriginal && caption.originalText !== caption.simplifiedText && (
              <details className="mt-2">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  Simplified version
                </summary>
                <p className={`${getFontSizeClass()} mt-2 text-gray-300`}>
                  {caption.simplifiedText}
                </p>
              </details>
            )}
          </div>
        ))
      )}
    </div>
  );
}
