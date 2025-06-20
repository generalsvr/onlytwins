'use client';

import { useModalStore } from '@/lib/stores/modalStore';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from 'next/dist/client/components/react-dev-overlay/ui/components/errors/dev-tools-indicator/utils';
import useWindowSize from '@/lib/hooks/useWindowSize';

export default function Modal() {
  const { isOpen, type, props, closeModal, content } = useModalStore();
  const { isMobile } = useWindowSize()
  const [mounted, setMounted] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    (isOpen);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      ('123');
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        ('343');
        closeModal(); // Закрытие модалки
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed w-screen h-screen inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modelRef} className={`relative ${isMobile ? 'w-full h-full'  : 'min-w-[320px]'}  `}>
        <button className="absolute top-4 right-4 text-white z-20" onClick={closeModal}>
          ✕
        </button>
        <div className={'relative z-10 bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl overflow-hidden pb-6 h-full'}>
          {content}
        </div>

      </div>
    </div>,
    document.body
  );
}
