import React from 'react';
import { Loader } from '@/components/ui/loader';
const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden animate-custom-pulse">
      <div className="relative aspect-[3/4] bg-zinc-800"></div>
      {/*<div className="p-4">*/}
      {/*  <div className="flex justify-between items-center mb-1">*/}
      {/*    <div className="h-6 bg-zinc-700 rounded w-1/3"></div>*/}
      {/*    <div className="h-4 bg-zinc-700 rounded w-1/6"></div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};
export default function Loading() {
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md transition-all duration-300">
    <div className="relative z-5">
      <div className="loader animate-bounce flex  justify-center ">
        <p className={'z-20 text-white text-center mt-[21px] font-bold text-[14px]'}>LOADING</p>
      </div>
    </div>
  </div>
}
