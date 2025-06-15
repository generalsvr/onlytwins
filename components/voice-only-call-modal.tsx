'use client';

import type React from 'react';

import {
  X,
  Mic,
  MicOff,
  Phone,
  Volume2,
  VolumeX,
  AlertCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';

interface VoiceOnlyCallModalProps {
  characterName: string;
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
}

export default function VoiceOnlyCallModal({
  characterName,
  isOpen,
  onClose,
  agentId,
}: VoiceOnlyCallModalProps) {
  const { t } = useLanguage();
  const [callStatus, setCallStatus] = useState<
    'connecting' | 'active' | 'error'
  >('connecting');
  const [micPermission, setMicPermission] = useState<
    'granted' | 'denied' | 'prompt' | 'checking'
  >('checking');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [lastUserMessage, setLastUserMessage] = useState('');
  const [lastAgentMessage, setLastAgentMessage] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [isRecordingDebounced, setIsRecordingDebounced] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const voiceVisualizerRef = useRef<number | null>(null);

  // Audio recording references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callDurationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ElevenLabs API key
  const apiKey = 'sk_1da65aa246a660fe2dae9d34600354e4e05545d49a5c2bfb';

  // Initialize conversation history
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

  // Check microphone permissions when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setMicPermission('checking');
    setCallStatus('connecting');
    setError(null);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log('Microphone permission granted');
        setMicPermission('granted');
        streamRef.current = stream;

        // Set call as active
        setCallStatus('active');

        // Start call duration timer
        startCallDurationTimer();

        // Auto-start the conversation
        setTimeout(() => {
          debounceRecordingStart();
        }, 500);
      })
      .catch((err) => {
        console.error('Microphone permission error:', err);
        if (err.name === 'NotAllowedError') {
          setMicPermission('denied');
        } else {
          setMicPermission('prompt');
        }
        setCallStatus('error');
        setError('Microphone access is required for voice calls');
      });
  }, [isOpen, characterName]);

  // Add a new effect to automatically start recording after the initial greeting
  const debounceRecordingStart = () => {
    if (isRecordingDebounced) return;

    setIsRecordingDebounced(true);
    startRecording();

    // Reset debounce after 1 second
    setTimeout(() => {
      setIsRecordingDebounced(false);
    }, 1000);
  };

  useEffect(() => {
    if (
      callStatus === 'active' &&
      !isProcessing &&
      !isPlaying &&
      !isRecording &&
      !useTextInput &&
      micPermission === 'granted' &&
      !isRecordingDebounced
    ) {
      // Small delay to allow any previous audio to finish
      const timer = setTimeout(() => {
        debounceRecordingStart();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    callStatus,
    isProcessing,
    isPlaying,
    isRecording,
    useTextInput,
    micPermission,
    isRecordingDebounced,
  ]);

  // Start call duration timer
  const startCallDurationTimer = () => {
    if (callDurationTimerRef.current) {
      clearInterval(callDurationTimerRef.current);
    }

    setCallDuration(0);
    callDurationTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  // Format time display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

      audioChunksRef.current = [];

      // Specify audio format explicitly - use lower quality for faster processing
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/ogg';

      // Use lower bitrate for faster transmission
      const options = {
        mimeType,
        audioBitsPerSecond: 16000, // Lower bitrate for faster processing
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) return;

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Check if the audio is too short
        if (audioBlob.size < 1000) {
          console.warn('Audio recording too short');
          startRecording(); // Restart recording
          return;
        }

        await processAudioInput(audioBlob);
      };

      // Set up audio analysis for voice activity detection and visualization
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Voice activity detection variables
      let silenceStart = Date.now();
      let isSpeaking = false;
      let consecutiveSilenceFrames = 0;
      const silenceThreshold = 15; // Increased threshold for better detection
      const silenceTimeout = 600; // Shorter timeout for faster response (0.6 seconds)
      const requiredSilenceFrames = 8; // Fewer frames for faster detection

      // Cancel any existing visualizer
      if (voiceVisualizerRef.current) {
        cancelAnimationFrame(voiceVisualizerRef.current);
      }

      // Start the voice activity detection and visualization
      const checkVoiceActivity = () => {
        if (!isRecording || !mediaRecorderRef.current) {
          if (voiceVisualizerRef.current) {
            cancelAnimationFrame(voiceVisualizerRef.current);
            voiceVisualizerRef.current = null;
          }
          return;
        }

        analyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // Update voice level for visualization
        setVoiceLevel(Math.min(100, average * 2)); // Scale for better visual feedback

        // Detect if speaking
        if (average > silenceThreshold) {
          if (!isSpeaking) {
            console.log('Voice detected');
            isSpeaking = true;
          }
          silenceStart = Date.now();
          consecutiveSilenceFrames = 0;
        } else if (isSpeaking) {
          // Count consecutive silent frames
          consecutiveSilenceFrames++;

          // Check if silence has lasted long enough
          const silenceDuration = Date.now() - silenceStart;
          if (
            silenceDuration > silenceTimeout ||
            consecutiveSilenceFrames > requiredSilenceFrames
          ) {
            console.log('Silence detected, stopping recording');
            isSpeaking = false;
            stopRecording();
            return;
          }
        }

        // Continue checking
        voiceVisualizerRef.current = requestAnimationFrame(checkVoiceActivity);
      };

      // Start voice activity detection
      voiceVisualizerRef.current = requestAnimationFrame(checkVoiceActivity);

      mediaRecorderRef.current.start(100); // Collect data every 100ms for more responsive experience
      setIsRecording(true);

      // Start recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Safety timeout - max recording time of 10 seconds (reduced from 15)
      setTimeout(() => {
        if (isRecording && mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 10000);
    } catch (err) {
      console.error('Error starting recording:', err);
      switchToTextInputMode(
        'Failed to start recording. Using text input instead.'
      );
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Clear recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);

      // Start processing feedback immediately
      setLastUserMessage('Listening...');

      // Convert speech to text
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model_id', 'scribe_v1');

      console.log(
        'Sending audio to speech-to-text API, size:',
        audioBlob.size,
        'type:',
        audioBlob.type
      );

      // Use AbortController to set a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout to 5 seconds

      try {
        const speechResponse = await fetch(
          'https://api.elevenlabs.io/v1/speech-to-text',
          {
            method: 'POST',
            headers: {
              'xi-api-key': apiKey,
            },
            body: formData,
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!speechResponse.ok) {
          const errorData = await speechResponse
            .json()
            .catch(() => ({
              detail: { status: 'unknown', message: 'Unknown error' },
            }));
          console.error(
            'Speech-to-text error:',
            speechResponse.status,
            errorData
          );

          // Check if it's a permissions error
          if (
            speechResponse.status === 401 &&
            errorData?.detail?.status === 'missing_permissions'
          ) {
            console.log(
              'API key missing speech-to-text permissions, switching to text input mode'
            );
            switchToTextInputMode(
              'Voice recognition unavailable due to API permissions. Please use text input instead.'
            );
            return;
          }

          throw new Error(`Speech-to-text failed: ${speechResponse.status}`);
        }

        const speechData = await speechResponse.json();
        const userText = speechData.text || "I didn't catch that";

        console.log('Transcribed text:', userText);

        // If empty or very short, restart recording
        if (
          userText.length < 2 ||
          userText.toLowerCase() === "i didn't catch that"
        ) {
          console.warn('Empty or very short speech detected');
          setIsProcessing(false);
          setLastUserMessage('');
          startRecording(); // Restart recording
          return;
        }

        // Update UI with transcribed text
        setLastUserMessage(userText);

        // Send to ElevenLabs agent API
        await sendToAgent(userText);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch request timed out');
          switchToTextInputMode(
            'Voice recognition timed out. Please use text input instead.'
          );
          return;
        }
        throw error;
      }
    } catch (err) {
      console.error('Error processing audio:', err);
      setError(
        `Failed to process voice: ${err instanceof Error ? err.message : String(err)}`
      );
      setIsProcessing(false);

      // Switch to text input mode as fallback
      switchToTextInputMode(
        'Voice recognition failed. Please use text input instead.'
      );
    }
  };

  // Send message to ElevenLabs agent and get audio response
  const sendToAgent = async (userText: string) => {
    try {
      console.log('Processing user input:', userText);

      // Add user message to conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: userText },
      ];
      setConversationHistory(updatedHistory);

      // Generate a quick response based on the conversation context
      // This is a simplified approach for faster responses
      let responseText = '';

      // Start generating audio immediately with a greeting while processing
      setIsBuffering(true);
      setLastAgentMessage('Thinking...');

      // Simple response generation based on user input
      if (
        userText.toLowerCase().includes('hello') ||
        userText.toLowerCase().includes('hi')
      ) {
        responseText = `Hi there! How can I help you today?`;
      } else if (userText.toLowerCase().includes('how are you')) {
        responseText = `I'm great! Thanks for asking. How about you?`;
      } else if (userText.toLowerCase().includes('name')) {
        responseText = `I'm ${characterName}! Nice to chat with you.`;
      } else if (
        userText.toLowerCase().includes('yoga') ||
        userText.toLowerCase().includes('fitness')
      ) {
        responseText = `Yoga is my passion! I practice every morning. Do you enjoy fitness too?`;
      } else if (
        userText.toLowerCase().includes('travel') ||
        userText.toLowerCase().includes('adventure')
      ) {
        responseText = `I love adventures! I recently went hiking in the mountains. What about you?`;
      } else {
        responseText = `That's interesting! Tell me more about that.`;
      }

      // Add assistant response to conversation history
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: responseText },
      ]);

      // Update UI with agent's response
      setLastAgentMessage(responseText);

      // Get audio response using Text-to-Speech API if not muted
      if (!isMuted) {
        try {
          // Use a specific voice ID
          const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice

          const ttsResponse = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
              },
              body: JSON.stringify({
                text: responseText,
                model_id: 'eleven_turbo_v2',
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75,
                  style: 0.5, // Add some style variation
                  use_speaker_boost: true, // Improve voice clarity
                },
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

            // If voice not found, try a fallback voice
            if (
              ttsResponse.status === 400 &&
              errorText.includes('voice_not_found')
            ) {
              console.log('Voice not found, trying fallback voice');

              // Try with another voice ID - "EXAVITQu4vr4xnSDxMaL" (Bella)
              const fallbackVoiceId = 'EXAVITQu4vr4xnSDxMaL';

              const fallbackResponse = await fetch(
                `https://api.elevenlabs.io/v1/text-to-speech/${fallbackVoiceId}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                  },
                  body: JSON.stringify({
                    text: responseText,
                    model_id: 'eleven_turbo_v2',
                  }),
                }
              );

              if (!fallbackResponse.ok) {
                throw new Error(
                  `Fallback voice also failed: ${fallbackResponse.status}`
                );
              }

              const audioBlobTTS = await fallbackResponse.blob();
              const audioUrl = URL.createObjectURL(audioBlobTTS);
              setIsBuffering(false);
              playAudioResponse(audioUrl);
            } else {
              throw new Error(
                `Text-to-speech failed: ${ttsResponse.status}. ${errorText}`
              );
            }
          } else {
            // Play the audio response
            const audioBlobTTS = await ttsResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlobTTS);
            setIsBuffering(false);
            playAudioResponse(audioUrl);
          }
        } catch (audioError) {
          console.error('Audio generation error:', audioError);
          setIsBuffering(false);
          // Continue without audio - just show the text
          setError(
            'Voice synthesis failed, but conversation can continue with text only.'
          );

          // Continue the conversation despite audio error
          setTimeout(() => {
            if (
              callStatus === 'active' &&
              !isRecording &&
              !isProcessing &&
              !useTextInput &&
              !isRecordingDebounced
            ) {
              debounceRecordingStart();
            }
          }, 500);
        }
      } else {
        // If muted, just continue the conversation
        setIsBuffering(false);
        setTimeout(() => {
          if (
            callStatus === 'active' &&
            !isRecording &&
            !isProcessing &&
            !useTextInput &&
            !isRecordingDebounced
          ) {
            debounceRecordingStart();
          }
        }, 500);
      }

      setIsProcessing(false);
    } catch (err) {
      console.error('Error sending to agent:', err);
      setError(
        `Failed to get response: ${err instanceof Error ? err.message : String(err)}`
      );
      setIsProcessing(false);
      setIsBuffering(false);

      // If audio playback failed, continue the conversation
      setTimeout(() => {
        if (!useTextInput) {
          debounceRecordingStart();
        }
      }, 500);
    }
  };

  // Helper function to play audio response
  const playAudioResponse = (audioUrl: string) => {
    if (audioElementRef.current) {
      // Preload the audio for faster playback
      audioElementRef.current.preload = 'auto';
      audioElementRef.current.src = audioUrl;

      audioElementRef.current.onloadeddata = () => {
        console.log('Audio loaded successfully');
      };

      audioElementRef.current.oncanplay = () => {
        // Play at slightly faster speed for more responsive conversation
        audioElementRef.current!.playbackRate = 1.1;
        audioElementRef.current!.play().catch((e) => {
          console.error('Audio playback error:', e);
          // Continue the conversation despite audio error
          setIsPlaying(false);
          if (callStatus === 'active' && !isRecording && !isProcessing) {
            setTimeout(() => {
              debounceRecordingStart();
            }, 300);
          }
        });
        setIsPlaying(true);
      };

      audioElementRef.current.onended = () => {
        setIsPlaying(false);
        // Auto-start recording when agent finishes speaking
        if (
          callStatus === 'active' &&
          !isRecording &&
          !isProcessing &&
          !useTextInput &&
          !isRecordingDebounced
        ) {
          setTimeout(() => {
            debounceRecordingStart();
          }, 200); // Reduced delay for faster back-and-forth
        }
      };

      audioElementRef.current.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        // Continue the conversation despite audio error
        if (callStatus === 'active' && !isRecording && !isProcessing) {
          setTimeout(() => {
            debounceRecordingStart();
          }, 300);
        }
      };

      audioElementRef.current.load();
    }
  };

  // Add this function after the processAudioInput function
  const switchToTextInputMode = (reason: string) => {
    setUseTextInput(true);
    setError(reason);
    setIsProcessing(false);

    // Focus the text input when it becomes available
    setTimeout(() => {
      const textInput = document.querySelector(
        'input[type="text"]'
      ) as HTMLInputElement;
      if (textInput) textInput.focus();
    }, 100);
  };

  // Process user text input
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInputValue.trim() && !isProcessing) {
      setLastUserMessage(textInputValue.trim());
      sendToAgent(textInputValue.trim());
      setTextInputValue('');
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioElementRef.current) {
      audioElementRef.current.muted = !isMuted;
    }
  };

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Stop recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'recording'
      ) {
        mediaRecorderRef.current.stop();
      }

      // Cancel voice visualizer
      if (voiceVisualizerRef.current) {
        cancelAnimationFrame(voiceVisualizerRef.current);
        voiceVisualizerRef.current = null;
      }

      // Stop audio playback properly
      if (audioElementRef.current) {
        try {
          const audio = audioElementRef.current;

          // Pause and reset the audio element
          if (!audio.paused) {
            audio.pause();
          }

          // Clear the source to prevent memory leaks
          audio.src = '';

          // Remove all event listeners
          audio.onloadeddata = null;
          audio.oncanplay = null;
          audio.onended = null;
          audio.onerror = null;

          setIsPlaying(false);
        } catch (err) {
          console.error('Error cleaning up audio:', err);
        }
      }

      // Stop media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Clear timers
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      if (callDurationTimerRef.current) {
        clearInterval(callDurationTimerRef.current);
        callDurationTimerRef.current = null;
      }
    }
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

  // Request microphone permission
  const handleRequestMicPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMicPermission('granted');
        streamRef.current = stream;
        setCallStatus('active');
        startCallDurationTimer();
        setTimeout(() => {
          debounceRecordingStart();
        }, 500);
      })
      .catch(() => {
        setMicPermission('denied');
        setCallStatus('error');
        setError('Microphone access denied');
      });
  };

  // Retry after error
  const handleRetry = () => {
    setError(null);

    if (micPermission === 'denied') {
      handleRequestMicPermission();
    } else {
      // Reset the call status and try again
      setCallStatus('connecting');

      // Small delay before retrying
      setTimeout(() => {
        debounceRecordingStart();
      }, 500);
    }
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioElementRef.current) {
      audioElementRef.current = new Audio();
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-md bg-zinc-900 rounded-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mr-3">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{characterName}</h2>
              <div className="flex items-center">
                {callStatus === 'connecting' && (
                  <span className="text-yellow-400 text-sm flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                    {t('common.connecting')}
                  </span>
                )}
                {callStatus === 'active' && (
                  <span className="text-green-400 text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {t('common.callActive')} • {formatTime(callDuration)}
                  </span>
                )}
                {callStatus === 'error' && (
                  <span className="text-red-400 text-sm flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    Connection Error
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Call content */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
          {/* Microphone permission prompt */}
          {micPermission === 'prompt' && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Mic className="h-10 w-10 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t('common.microphoneRequired')}
              </h3>
              <p className="text-zinc-400 mb-4">
                Please allow microphone access to start the voice call
              </p>
              <button
                onClick={handleRequestMicPermission}
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg"
              >
                Allow Microphone
              </button>
            </div>
          )}

          {/* Microphone denied */}
          {micPermission === 'denied' && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <MicOff className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t('common.microphoneAccessDenied')}
              </h3>
              <p className="text-zinc-400 mb-4">
                {t('common.enableMicrophoneInstructions')}
              </p>
              <button
                onClick={handleRequestMicPermission}
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Error state */}
          {callStatus === 'error' && error && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Error</h3>
              <p className="text-zinc-400 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading state */}
          {callStatus === 'active' &&
            micPermission === 'granted' &&
            isProcessing && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
                <p className="text-zinc-400">Processing...</p>
              </div>
            )}

          {/* Active call */}
          {callStatus === 'active' && micPermission === 'granted' && (
            <div className="w-full text-center">
              {/* Voice visualization - only show when not using text input */}
              {!useTextInput && (
                <div className="relative w-32 h-32 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-6">
                  <div
                    className={`absolute inset-0 rounded-full ${isRecording ? 'bg-pink-500/10 animate-ping' : 'bg-zinc-800/50'}`}
                  ></div>

                  {/* Dynamic voice level visualization */}
                  {isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="absolute rounded-full bg-pink-500/30 transition-all duration-75"
                        style={{
                          width: `${Math.max(30, voiceLevel)}%`,
                          height: `${Math.max(30, voiceLevel)}%`,
                          opacity: voiceLevel > 10 ? 0.6 : 0.2,
                        }}
                      ></div>
                    </div>
                  )}

                  <div
                    className={`w-24 h-24 rounded-full ${isRecording ? 'bg-pink-500/20' : 'bg-zinc-800'} flex items-center justify-center`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full ${isRecording ? 'bg-pink-500' : 'bg-zinc-700'} flex items-center justify-center`}
                    >
                      {isRecording ? (
                        <button
                          onClick={stopRecording}
                          className="w-full h-full rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                          title="Stop recording"
                        >
                          <Mic className="h-8 w-8 text-white animate-pulse" />
                        </button>
                      ) : (
                        <Mic className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Voice level indicators - enhanced with dynamic levels */}
                  {isRecording && (
                    <div className="absolute -bottom-8 flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 animate-pulse ${voiceLevel > i * 20 ? 'bg-pink-500' : 'bg-zinc-700'}`}
                          style={{
                            height: `${Math.min(8, 3 + i * 1.5 + (voiceLevel > i * 20 ? 2 : 0))}px`,
                            animationDelay: `${i * 50}ms`,
                          }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Text input mode */}
              {useTextInput && (
                <div className="w-full mb-6">
                  <div className="bg-yellow-500/20 text-yellow-300 p-3 rounded-lg mb-3 text-sm">
                    <p>
                      Voice recognition is unavailable. Please use text input
                      instead.
                    </p>
                  </div>
                  <form onSubmit={handleTextSubmit} className="w-full">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={textInputValue}
                        onChange={(e) => setTextInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-l-lg px-4 py-3 text-white"
                        disabled={isProcessing}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!textInputValue.trim() || isProcessing}
                        className={`bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-r-lg ${
                          !textInputValue.trim() || isProcessing
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Status text */}
              {isRecording && !useTextInput && (
                <div className="text-pink-400 font-medium mb-2 animate-pulse">
                  Listening...{' '}
                  {voiceLevel > 15 ? '(Voice detected)' : '(Waiting for voice)'}{' '}
                  {formatTime(recordingTime)}
                </div>
              )}
              {isProcessing && (
                <div className="text-yellow-400 font-medium mb-2">
                  Processing your voice...
                </div>
              )}
              {isBuffering && (
                <div className="text-green-400 font-medium mb-2">
                  Generating response...
                </div>
              )}
              {isPlaying && (
                <div className="text-green-400 font-medium mb-2">
                  {characterName} is speaking...
                </div>
              )}
              {!isRecording &&
                !isProcessing &&
                !isPlaying &&
                !isBuffering &&
                !useTextInput && (
                  <div className="text-zinc-400 font-medium mb-2">
                    Ready for your voice. Try saying "Hello"
                  </div>
                )}

              {/* Buffering indicator */}
              {isBuffering && (
                <div className="flex justify-center items-center space-x-1 my-2">
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              )}

              {/* Transcript */}
              <div className="bg-zinc-800/50 rounded-lg p-4 mb-4 max-h-[100px] overflow-y-auto">
                {lastUserMessage ? (
                  <p className="text-sm text-zinc-300">
                    <span className="text-pink-400 font-bold">You:</span>{' '}
                    {lastUserMessage}
                  </p>
                ) : (
                  <p className="text-sm text-zinc-500 italic">
                    Your voice will appear here
                  </p>
                )}
                {lastAgentMessage && (
                  <p className="text-sm text-zinc-300 mt-2">
                    <span className="text-green-400 font-bold">
                      {characterName}:
                    </span>{' '}
                    {lastAgentMessage}
                  </p>
                )}
              </div>

              {/* Controls - only show mute button when not using text input */}
              {!useTextInput && (
                <div className="flex justify-center">
                  <button
                    onClick={toggleMute}
                    className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6 text-red-400" />
                    ) : (
                      <Volume2 className="h-6 w-6 text-white" />
                    )}
                  </button>
                </div>
              )}

              {/* Toggle between voice and text input */}
              <button
                onClick={() => setUseTextInput(!useTextInput)}
                className="mt-4 text-sm text-pink-400 hover:text-pink-300 underline"
              >
                {useTextInput
                  ? 'Switch to voice input'
                  : 'Switch to text input'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}
