'use client';

import { X, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface IframeVoiceCallModalProps {
  characterName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function IframeVoiceCallModal({
  characterName,
  isOpen,
  onClose,
}: IframeVoiceCallModalProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully');
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setIsLoading(false);
    setLoadError(null);
  };

  // Handle iframe error
  const handleIframeError = () => {
    console.error('Iframe failed to load');
    setLoadError('Failed to load voice call interface');
    setIsLoading(false);
  };

  // Set up loading timeout and iframe
  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    setLoadError(null);

    // Set a timeout to handle cases where the iframe doesn't load
    loadTimeoutRef.current = setTimeout(() => {
      console.warn('Iframe load timeout');
      setLoadError('Voice call interface took too long to load');
      setIsLoading(false);
    }, 10000); // 10 seconds timeout

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle retry
  const handleRetry = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setLoadError(null);

      // Force iframe reload
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);

      // Set a new timeout
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      loadTimeoutRef.current = setTimeout(() => {
        setLoadError('Voice call interface took too long to load');
        setIsLoading(false);
      }, 10000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold">
            {t('common.voiceCallWith')} {characterName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-800"
            aria-label={t('common.close')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Widget container */}
        <div className="flex-1 min-h-[400px] relative">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-zinc-400">Initializing voice call...</p>
            </div>
          )}

          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-10 p-4">
              <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-4 text-center">
                <p className="font-bold mb-2">Error</p>
                <p>{loadError}</p>
              </div>
              <button
                onClick={handleRetry}
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src="/elevenlabs-standalone.html"
              className="w-full h-full min-h-[400px] border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title="Voice Call"
              allow="microphone; camera"
            ></iframe>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
          >
            {t('common.endCall')}
          </button>
        </div>
      </div>
    </div>
  );
}
