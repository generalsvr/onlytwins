'use client';

import { useModalStore } from '@/lib/stores/modalStore';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from 'next/dist/client/components/react-dev-overlay/ui/components/errors/dev-tools-indicator/utils';
import useWindowSize from '@/lib/hooks/useWindowSize';
import { X } from 'lucide-react';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import { Loader } from '@/components/ui/loader';

export default function Modal() {
  const { isOpen, type, props, closeModal, content } = useModalStore();
  const isLoading = useLoadingStore((state) => state.isLoading);
  const { isMobile } = useWindowSize();
  const [mounted, setMounted] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    isOpen;
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        closeModal(); // Закрытие модалки
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  if (isLoading && mounted) return <Loader />;
  if (!isOpen || !mounted) return null;

  // bg-zinc-800/60 backdrop-blur-xl rounded-2xl border border-zinc-700/30 shadow-2xl
  return createPortal(
    <div className="fixed w-screen h-[100svh] inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div
        ref={modelRef}
        className={`relative ${isMobile ? 'w-full h-full flex justify-center items-center' : 'min-w-[320px]'} `}
      >
        <div className={'relative overflow-auto max-h-full w-full  p-4'}>
          <div className={'relative max-w-full max-h-full '}>
            <button
              onClick={closeModal}
              className="absolute z-20 top-5 right-3 p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
            >
              <X size={24} />
            </button>
            {content}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
