import { Film } from 'lucide-react';

interface VideoIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function VideoIndicator({
  className = '',
  size = 'md',
}: VideoIndicatorProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 p-1',
    md: 'h-8 w-8 p-1.5',
    lg: 'h-10 w-10 p-2',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  return (
    <div
      className={`rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white ${
        sizeClasses[size]
      } ${className}`}
    >
      <Film size={iconSizes[size]} />
    </div>
  );
}
