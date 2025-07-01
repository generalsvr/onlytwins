import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVoiceRecordingOptions {
  onRecordingComplete?: (audioBlob: Blob, audioUrl: string) => void;
  onError?: (error: string) => void;
  maxDuration?: number; // в секундах, по умолчанию 300 (5 минут)
}

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  recordingTime: number;
  audioUrl: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
  createPermanentUrl: () => string | null; // Новый метод
  isSupported: boolean;
  error: string | null;
}

export const useVoiceRecording = ({
  onRecordingComplete,
  onError,
  maxDuration = 300,
}: UseVoiceRecordingOptions = {}): UseVoiceRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentBlobRef = useRef<Blob | null>(null); // Сохраняем blob для создания новых URL
  const permanentUrlsRef = useRef<Set<string>>(new Set()); // Отслеживаем постоянные URL

  // Проверка поддержки браузером
  const isSupported =
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    typeof MediaRecorder !== 'undefined';

  // Очистка ресурсов
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  // Создание постоянного URL (не будет отозван при resetRecording)
  const createPermanentUrl = useCallback(() => {
    if (!currentBlobRef.current) return null;

    const permanentUrl = URL.createObjectURL(currentBlobRef.current);
    permanentUrlsRef.current.add(permanentUrl);
    return permanentUrl;
  }, []);

  // Начало записи
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const errorMsg = 'Voice recording is not supported in this browser';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (isRecording) return;

    try {
      setError(null);

      // Запрос доступа к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Создание MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/wav';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      // Обработчики событий MediaRecorder
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        currentBlobRef.current = audioBlob; // Сохраняем blob
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete?.(audioBlob, url);
        cleanup();
      };

      mediaRecorder.onerror = (event) => {
        const errorMsg = 'Recording failed';
        setError(errorMsg);
        onError?.(errorMsg);
        cleanup();
      };

      // Начало записи
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Запуск таймера
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (err) {
      let errorMsg = 'Failed to start recording';

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMsg =
            'Microphone access denied. Please allow microphone access and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMsg =
            'No microphone found. Please connect a microphone and try again.';
        } else if (err.name === 'NotSupportedError') {
          errorMsg = 'Recording is not supported in this browser.';
        } else {
          errorMsg = err.message;
        }
      }

      setError(errorMsg);
      onError?.(errorMsg);
      cleanup();
    }
  }, [
    isSupported,
    isRecording,
    maxDuration,
    onRecordingComplete,
    onError,
    cleanup,
  ]);

  // Остановка записи
  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;

    try {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
      cleanup();
      setIsRecording(false);
    }
  }, [isRecording, cleanup]);

  // Сброс записи (отзывает только текущий temporary URL)
  const resetRecording = useCallback(() => {
    cleanup();
    setIsRecording(false);
    setRecordingTime(0);
    setError(null);

    // Отзываем только текущий temporary URL, не permanent
    if (audioUrl && !permanentUrlsRef.current.has(audioUrl)) {
      // URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    currentBlobRef.current = null;
  }, [audioUrl, cleanup]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      // Отзываем все URL при размонтировании
      if (audioUrl) {
        // URL.revokeObjectURL(audioUrl);
      }
      permanentUrlsRef.current.forEach((url) => {
        // URL.revokeObjectURL(url);
      });
      permanentUrlsRef.current.clear();
      cleanup();
    };
  }, [cleanup]); // Убрали audioUrl из зависимостей

  return {
    isRecording,
    recordingTime,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording,
    createPermanentUrl, // Новый метод
    isSupported,
    error,
  };
};
