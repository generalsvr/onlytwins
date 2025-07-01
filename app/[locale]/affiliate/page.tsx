'use client';

import { useState, useEffect } from 'react';
import ShareInvitePopup from '@/components/share-invite-popup';
import Image from 'next/image';


export default function AffiliatePage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className={`${isMobile ? 'p-4' : 'pt-20 px-8 max-w-4xl mx-auto'}`}>
      <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold mb-4`}>
        {/*{t('affiliate.title') || 'Affiliate'}*/}
      </h1>

      <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} mb-2`}>
        {/*{t('affiliate.inviteFriends') || 'Invite Friends'}*/}
      </h2>
      <p className="text-zinc-400 mb-6">
        {/*{t('affiliate.spreadLove') || 'Spread the love and earn rewards'}*/}
      </p>

      <div
        className={`border border-pink-400/30 rounded-xl ${isMobile ? 'p-6' : 'p-8'} mb-6 ${isMobile ? '' : 'bg-zinc-900/50'}`}
      >
        <h3 className="text-zinc-400 mb-1">
          {/*{t('affiliate.percentage') || 'Commission Rate'}*/}
        </h3>
        <div className="flex justify-between items-center">
          <h2 className={`${isMobile ? 'text-6xl' : 'text-7xl'} font-bold`}>
            50%
          </h2>
          <div className="relative w-16 h-16">
            <Image
              src="/kiss-mark.png"
              alt="Kiss Mark"
              width={60}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
        <p className="text-pink-400 mt-2">
          {/*{t('affiliate.commission') || 'Commission on all purchases'}*/}
        </p>
      </div>

      {!isMobile && (
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-pink-500">
                <path
                  fill="currentColor"
                  d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
            <p className="text-zinc-400">
              Share your unique invite code with friends
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-purple-500">
                <path
                  fill="currentColor"
                  d="M12,13A5,5 0 0,1 7,8H9A3,3 0 0,0 12,11A3,3 0 0,0 15,8H17A5,5 0 0,1 12,13M12,3A3,3 0 0,1 15,6H9A3,3 0 0,1 12,3M19,6H17A5,5 0 0,0 12,1A5,5 0 0,0 7,6H5C3.89,6 3,6.89 3,8V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V8C21,6.89 20.1,6 19,6Z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">They Subscribe</h3>
            <p className="text-zinc-400">When they make a purchase, you earn</p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 text-center border border-zinc-800">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {/*<svg viewBox="0 0 24 24" className="w-8 h-8 text-green-500">*/}
              {/*  <path*/}
              {/*    fill="currentColor"*/}
              {/*    d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z"*/}
              {/*  />*/}
              {/*</svg>*/}
            </div>
            <h3 className="text-xl font-bold mb-2">Get Paid</h3>
            <p className="text-zinc-400">
              Earn 50% commission on all purchases
            </p>
          </div>
        </div>
      )}

      <button
        className={`w-full bg-pink-400 text-white py-4 rounded-xl ${isMobile ? 'text-xl' : 'text-xl font-medium'} hover:bg-pink-500 transition-colors`}
        onClick={() => setIsPopupOpen(true)}
      >

      </button>

      <ShareInvitePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}
