import React, { useCallback } from 'react';
import { useModalStore } from '@/lib/stores/modalStore';
import { AxiosError } from 'axios';
import ErrorPopup from '@/components/modals/error';

export const useErrorHandler = () => {
  const { openModal, closeModal } = useModalStore((state) => state);
  const errorHandler = (error: AxiosError) => {
    if (!error) return;
    openModal({
      type: 'message',
      content: <ErrorPopup error={error} onClose={closeModal} />,
    });
  };
  return {
    errorHandler,
  };
};
