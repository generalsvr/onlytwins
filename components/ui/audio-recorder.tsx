'use client';

import React, { useState, useRef } from 'react';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        chunks.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecordingTime(0);
  };

  const playAudio = () => {
    try {
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setAudio(audio);
        audio.play();
      }
    } catch (e) {
      console.error('play error', e);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Audio Recorder</h1>
      <div className="space-y-4">
        <div>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-lg font-medium ${
              isRecording ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
        {isRecording && (
          <p className="text-sm text-gray-400">Recording... {recordingTime}s</p>
        )}
        {audioUrl && (
          <div>
            <button
              onClick={playAudio}
              className="px-4 py-2 bg-blue-500 rounded-lg font-medium"
            >
              Play Recording
            </button>
          </div>
        )}
        <div className={"text-white"}>this audio:</div>
        {audioUrl && (
          <>
            <div className={"text-white"}>this your audio:</div>
            <audio src={audioUrl} controls={true} />
            <p>{audioUrl}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
