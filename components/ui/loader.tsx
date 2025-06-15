import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import { Loader2 } from 'lucide-react';
import React from 'react';
import SafeImage from '@/components/safe-image';

export const Loader: React.FC = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md transition-all duration-300">
      <div className="relative z-5">
        <div className="loader animate-bounce flex  justify-center ">
          <p className={'z-20 text-white text-center mt-[21px] font-bold text-[14px]'}>LOADING</p>
        </div>
      </div>
    </div>
  );
};