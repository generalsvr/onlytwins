'use client';

import { useEffect, useState } from 'react';

interface VoiceChatStatusAnnouncerProps {
  isVisible: boolean;
}

export default function VoiceChatStatusAnnouncer({
  isVisible,
}: VoiceChatStatusAnnouncerProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (isVisible) {
      setAnnouncement('Voice chat widget is now open. Press Escape to close.');
    } else {
      setAnnouncement('Voice chat widget is now closed.');
    }

    // Clear announcement after it's been read by screen readers
    const timer = setTimeout(() => {
      setAnnouncement('');
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {announcement}
    </div>
  );
}
