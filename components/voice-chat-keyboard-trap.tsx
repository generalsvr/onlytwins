'use client';

import { useEffect, useRef } from 'react';

interface VoiceChatKeyboardTrapProps {
  isActive: boolean;
  onEscape: () => void;
  containerId: string;
}

export default function VoiceChatKeyboardTrap({
  isActive,
  onEscape,
  containerId,
}: VoiceChatKeyboardTrapProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
        return;
      }

      // Trap focus within the widget container
      if (e.key === 'Tab') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        // If shift+tab on first element, move to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
        // If tab on last element, move to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus the first focusable element in the widget
    const container = document.getElementById(containerId);
    if (container) {
      const firstFocusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      if (firstFocusable) {
        setTimeout(() => {
          firstFocusable.focus();
        }, 100);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus when component unmounts
      if (previousFocusRef.current) {
        setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 100);
      }
    };
  }, [isActive, onEscape, containerId]);

  return null;
}
