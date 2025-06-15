'use client';

import type React from 'react';

import {
  X,
  Mic,
  MicOff,
  RefreshCw,
  StopCircle,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface CustomVoiceCallModalProps {
  characterName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomVoiceCallModal({
  characterName,
  isOpen,
  onClose,
}: CustomVoiceCallModalProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<
    'granted' | 'denied' | 'prompt' | 'checking'
  >('checking');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [textInput, setTextInput] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimerId, setRecordingTimerId] =
    useState<NodeJS.Timeout | null>(null);

  // Audio recording references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ElevenLabs API credentials
  const apiKey = 'sk_1da65aa246a660fe2dae9d34600354e4e05545d49a5c2bfb';
  const agentId = 'yV4wd6xrm1fUcbFUKJax';

  // Initialize audio element
  useEffect(() => {
    if (!audioElementRef.current) {
      audioElementRef.current = new Audio();
      audioElementRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, []);

  // Check microphone permissions when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setMicPermission('checking');

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log('Microphone permission granted');
        setMicPermission('granted');
        // Store the stream for later use
        streamRef.current = stream;
      })
      .catch((err) => {
        console.error('Microphone permission error:', err);
        if (err.name === 'NotAllowedError') {
          setMicPermission('denied');
        } else {
          setMicPermission('prompt');
        }
        // Enable text input as fallback
        setUseTextInput(true);
      });
  }, [isOpen]);

  // Initialize conversation with a system message
  useEffect(() => {
    if (isOpen) {
      setConversationHistory([
        {
          role: 'system',
          content: `You are ${characterName}, a virtual companion. Keep responses concise and engaging. The user is talking to you via voice.`,
        },
      ]);
    }
  }, [isOpen, characterName]);

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

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [isOpen]);

  // Request microphone permission
  const handleRequestMicPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMicPermission('granted');
        setUseTextInput(false);
        streamRef.current = stream;
      })
      .catch(() => {
        setMicPermission('denied');
        setUseTextInput(true);
      });
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      setError(null);

      // Use existing stream or request a new one
      let stream = streamRef.current;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }

      audioContextRef.current = new AudioContext();
      audioChunksRef.current = [];

      // Specify audio format explicitly
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/ogg';

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      console.log(`Using MIME type: ${mimeType} for recording`);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) return;

        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });

        // Check if the audio is too short
        if (audioBlob.size < 1000) {
          setError('Audio recording too short. Please speak longer.');
          return;
        }

        await processUserInput(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Start recording timer
      const timerId = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setRecordingTimerId(timerId);
      setRecordingTime(0);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please check your microphone.');
      setUseTextInput(true);
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear recording timer
      if (recordingTimerId) {
        clearInterval(recordingTimerId);
        setRecordingTimerId(null);
      }
    }
  };

  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Process user input (either audio or text)
  const processUserInput = async (audioBlob?: Blob) => {
    try {
      setIsLoading(true);
      let userText = '';

      if (audioBlob) {
        // Process audio input
        try {
          // First, we need to convert the audio to text using ElevenLabs Speech-to-Text API
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');
          formData.append('model_id', 'scribe_v1'); // Using the valid model_id as specified in the error

          console.log(
            'Sending audio to ElevenLabs STT API',
            audioBlob.type,
            audioBlob.size
          );

          const speechResponse = await fetch(
            'https://api.elevenlabs.io/v1/speech-to-text',
            {
              method: 'POST',
              headers: {
                'xi-api-key': apiKey,
              },
              body: formData,
            }
          );

          if (!speechResponse.ok) {
            const errorText = await speechResponse
              .text()
              .catch(() => 'Unknown error');
            console.error(
              'Speech-to-text error:',
              speechResponse.status,
              errorText
            );

            // If STT fails, switch to text input
            setUseTextInput(true);
            throw new Error(
              `Speech-to-text failed: ${speechResponse.status}. ${errorText}`
            );
          }

          const speechData = await speechResponse.json();
          userText = speechData.text || "I didn't catch that";
        } catch (err) {
          console.error('Speech-to-text error:', err);
          throw new Error(
            `Speech-to-text error: ${err instanceof Error ? err.message : String(err)}`
          );
        }
      } else {
        // Use text input
        userText = textInput;
        setTextInput('');
      }

      // Add user message to conversation
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: userText },
      ];
      setConversationHistory(updatedHistory);
      setCurrentMessage(userText);

      // Now send the conversation to the ElevenLabs Conversation API
      try {
        console.log('Sending conversation to ElevenLabs API', updatedHistory);

        const conversationResponse = await fetch(
          `https://api.elevenlabs.io/v1/conversation/${agentId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': apiKey,
            },
            body: JSON.stringify({
              messages: updatedHistory,
            }),
          }
        );

        if (!conversationResponse.ok) {
          const errorText = await conversationResponse
            .text()
            .catch(() => 'Unknown error');
          console.error(
            'Conversation API error:',
            conversationResponse.status,
            errorText
          );
          throw new Error(
            `Conversation API failed: ${conversationResponse.status}. ${errorText}`
          );
        }

        const conversationData = await conversationResponse.json();
        const assistantMessage =
          conversationData.messages[conversationData.messages.length - 1];

        // Add assistant response to conversation history
        setConversationHistory([
          ...updatedHistory,
          { role: 'assistant', content: assistantMessage.content },
        ]);

        // Get audio response using Text-to-Speech API if not muted
        if (!isMuted) {
          try {
            const ttsResponse = await fetch(
              'https://api.elevenlabs.io/v1/text-to-speech/default',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'xi-api-key': apiKey,
                },
                body: JSON.stringify({
                  text: assistantMessage.content,
                  model_id: 'eleven_turbo_v2',
                }),
              }
            );

            if (!ttsResponse.ok) {
              const errorText = await ttsResponse
                .text()
                .catch(() => 'Unknown error');
              console.error(
                'Text-to-speech error:',
                ttsResponse.status,
                errorText
              );
              throw new Error(
                `Text-to-speech failed: ${ttsResponse.status}. ${errorText}`
              );
            }

            // Play the audio response
            const audioBlobTTS = await ttsResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlobTTS);

            if (audioElementRef.current) {
              audioElementRef.current.src = audioUrl;
              audioElementRef.current.play();
              setIsPlaying(true);
            }
          } catch (err) {
            console.error('Text-to-speech error:', err);
            // Continue without audio playback
          }
        }
      } catch (err) {
        console.error('Conversation API error:', err);
        throw new Error(
          `Conversation error: ${err instanceof Error ? err.message : String(err)}`
        );
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error processing input:', err);
      setError(`${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
    }
  };

  // Toggle recording state
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Toggle audio mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioElementRef.current) {
      audioElementRef.current.muted = !isMuted;
    }
  };

  // Handle text input submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && !isLoading) {
      processUserInput();
    }
  };

  // Toggle between voice and text input
  const toggleInputMode = () => {
    setUseTextInput(!useTextInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold">
            {t('common.voiceCallWith')} {characterName}
          </h2>
          <div className="flex items-center">
            {micPermission === 'granted' && !useTextInput && (
              <span className="mr-2 text-green-500 flex items-center">
                <Mic className="h-4 w-4 mr-1" />
                <span className="text-xs">Mic OK</span>
              </span>
            )}
            {micPermission === 'denied' && (
              <span className="mr-2 text-red-500 flex items-center">
                <MicOff className="h-4 w-4 mr-1" />
                <span className="text-xs">Mic Blocked</span>
              </span>
            )}
            {useTextInput && (
              <span className="mr-2 text-yellow-500 flex items-center">
                <span className="text-xs">Text Mode</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-zinc-800"
              aria-label={t('common.close')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Voice chat interface */}
        <div className="p-4 flex-1 flex flex-col overflow-hidden">
          {/* Conversation display */}
          <div className="flex-1 overflow-y-auto mb-4 bg-zinc-800/50 rounded-lg p-4">
            {conversationHistory
              .filter((msg) => msg.role !== 'system')
              .map((message, index) => (
                <div
                  key={index}
                  className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-pink-500 text-white'
                        : 'bg-zinc-700 text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-4 py-2 rounded-lg bg-zinc-700 text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
              <p className="text-sm">{error}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => setError(null)}
                  className="text-xs text-red-300 underline"
                >
                  Dismiss
                </button>
                {!useTextInput && (
                  <button
                    onClick={() => setUseTextInput(true)}
                    className="text-xs text-red-300 underline"
                  >
                    Switch to text input
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Microphone permission prompt */}
          {micPermission === 'prompt' && !useTextInput && (
            <div className="bg-zinc-800 p-4 rounded-lg mb-4 text-center">
              <p className="mb-3">
                Microphone access is required for voice calls
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleRequestMicPermission}
                  className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg flex items-center"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Allow Microphone
                </button>
                <button
                  onClick={() => setUseTextInput(true)}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-lg"
                >
                  Use Text Instead
                </button>
              </div>
            </div>
          )}

          {/* Microphone denied message */}
          {micPermission === 'denied' && !useTextInput && (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-4">
              <p className="font-bold mb-2">Microphone access denied</p>
              <p className="mb-3">
                Please enable microphone access in your browser settings to use
                voice calls.
              </p>
              <ol className="text-sm list-decimal pl-5 mb-3">
                <li>Click the lock/info icon in your address bar</li>
                <li>Find "Microphone" permissions</li>
                <li>Change the setting to "Allow"</li>
                <li>Refresh the page</li>
              </ol>
              <div className="flex justify-between">
                <button
                  onClick={handleRequestMicPermission}
                  className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
                <button
                  onClick={() => setUseTextInput(true)}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-lg"
                >
                  Use Text Instead
                </button>
              </div>
            </div>
          )}

          {/* Text input mode */}
          {useTextInput && (
            <form
              onSubmit={handleTextSubmit}
              className="flex items-center space-x-2 mb-4"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className={`bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg ${
                  !textInput.trim() || isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
              {micPermission === 'granted' && (
                <button
                  type="button"
                  onClick={toggleInputMode}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg"
                >
                  <Mic className="h-5 w-5" />
                </button>
              )}
            </form>
          )}

          {/* Voice controls */}
          {micPermission === 'granted' && !useTextInput && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={toggleRecording}
                disabled={isLoading || isPlaying}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-pink-500 hover:bg-pink-600'
                } ${isLoading || isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRecording ? (
                  <StopCircle className="h-8 w-8 text-white" />
                ) : (
                  <Mic className="h-8 w-8 text-white" />
                )}
              </button>

              {isRecording && (
                <div className="text-sm text-red-400 animate-pulse">
                  Recording... {formatRecordingTime(recordingTime)}
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={toggleMute}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={toggleInputMode}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg"
                  title="Switch to text input"
                >
                  <span className="text-xs">Aa</span>
                </button>
              </div>
            </div>
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
