'use client';

import { useModalStore } from '@/lib/stores/modalStore';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from 'next/dist/client/components/react-dev-overlay/ui/components/errors/dev-tools-indicator/utils';

export default function Modal() {
  const { isOpen, type, props, closeModal, content } = useModalStore();
  const [mounted, setMounted] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log(isOpen);
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      console.log('123');
      if (modelRef.current && !modelRef.current.contains(event.target)) {
        console.log('343');
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
    <div className=" fixed w-screen h-screen inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modelRef} className=" min-w-[320px] ">
        <button className="absolute top-4 right-4" onClick={closeModal}>
          ✕
        </button>
        {content}
      </div>
    </div>,
    document.body
  );
}
