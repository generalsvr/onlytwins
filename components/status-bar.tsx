'use client';

import { useEffect, useState } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      setTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
