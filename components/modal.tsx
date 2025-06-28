'use client';

import { useModalStore } from '@/lib/stores/modalStore';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from 'next/dist/client/components/react-dev-overlay/ui/components/errors/dev-tools-indicator/utils';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { X } from 'lucide-react';

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
  // bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl
  return createPortal(
    <div className="fixed w-screen h-screen inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div ref={modelRef} className={`relative ${isMobile ? 'w-full h-full' : 'min-w-[320px]'} `}>
        <button
          onClick={closeModal}
          className="absolute z-20 top-3 right-3 p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
        >
        <X size={24} />
        </button>
        <div className={"overflow-auto h-full w-full max-h-screen"}>
          {content}
        </div>

      </div>
    </div>,
    document.body
  );
}
