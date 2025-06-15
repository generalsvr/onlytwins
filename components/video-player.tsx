'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  className = '',
}: VideoPlayerProps) {
  const [isPlaying] = useState(autoPlay);
  const [isMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      // setIsPlaying(false) // No longer needed
      if (video) {
        video.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.error('Error playing video:', err);
          // setIsPlaying(false) // No longer needed
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        playsInline
        loop
        muted={isMuted}
      />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
        <div className="w-full h-1 bg-white/30 rounded-full">
          <div
            className="h-full bg-pink-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
