'use client';

import { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import VideoIndicator from './video-indicator';

interface VideoPreviewProps {
  src: string;
  poster?: string;
  className?: string;
  onPlay?: () => void;
}

export default function VideoPreview({
  src,
  poster,
  className = '',
  onPlay,
}: VideoPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      // Add a small delay before playing to avoid unnecessary playback for quick hover
      timeoutRef.current = setTimeout(() => {
        videoRef.current
          ?.play()
          .catch((err) => console.error('Error playing preview:', err));
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        muted
        playsInline
        loop
      />

      {/* Video indicator */}
      <div className="absolute top-2 left-2">
        <VideoIndicator size="sm" />
      </div>

      {/* Play button overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-16 w-16 rounded-full bg-pink-500/80 flex items-center justify-center text-white">
          <Play size={32} fill="white" />
        </div>
      </div>
    </div>
  );
}
