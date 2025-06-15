'use client';

import { useEffect, useState } from 'react';

export default function A11ySkipLink() {
  const [mounted, setMounted] = useState(false);

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return null;
}
