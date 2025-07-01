import { useLoadingStore } from '@/lib/stores/useLoadingStore';
import React from 'react';

export const Loader: React.FC = () => {

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