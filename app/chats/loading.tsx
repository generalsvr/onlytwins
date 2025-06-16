import React from 'react';

export default function Loading() {
  return (
    <div className={'flex flex-col gap-4'}>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="card-container flex flex-col gap-4 p-4 animate-skeleton rounded-xl relative">
            <div className="flex items-center gap-4   rounded-lg bg-transparent ">
              <div className="avatar-placeholder w-[65px] h-[65px] bg-gray-700 rounded-full "></div>
              <div className="flex-1">
                <div className="name-placeholder h-4 bg-gray-700 rounded w-1/3 mb-2 "></div>
                <div className="message-placeholder h-4 bg-gray-700 rounded w-2/3 "></div>
              </div>
            </div>
            <div className="timestamp-placeholder h-4 bg-gray-700 rounded w-32 absolute right-4 top-4 "></div>
          </div>
        ))}
    </div>
  );
}
