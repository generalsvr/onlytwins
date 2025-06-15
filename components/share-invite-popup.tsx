'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Share2, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

interface ShareInvitePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareInvitePopup({
  isOpen,
  onClose,
}: ShareInvitePopupProps) {
  const [inviteCode, setInviteCode] = useState('TWINS4U');
  const [copied, setCopied] = useState(false);
  const appLink = 'https://t.me/onlytwins_app_bot';
  const { t } = useLanguage();

  // Generate a random invite code on mount
  useEffect(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 7; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setInviteCode(result);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{t('share.title')}</h2>
          <button onClick={onClose} className="text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* App preview */}
          <div className="flex items-center mb-6">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden mr-4">
              <Image
                src="/app-icon.png"
                alt="OnlyTwins App"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{t('share.appName')}</h3>
              <p className="text-zinc-400">{t('share.appDesc')}</p>
            </div>
          </div>

          {/* Invite code */}
          <div className="mb-6">
            <label className="block text-zinc-400 mb-2">
              {t('share.inviteCode')}
            </label>
            <div className="flex">
              <div className="flex-1 bg-zinc-800 rounded-l-lg p-3 font-mono text-lg border-r border-zinc-700">
                {inviteCode}
              </div>
              <button
                onClick={() => copyToClipboard(inviteCode)}
                className="bg-zinc-800 rounded-r-lg px-4 flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                {copied ? (
                  <span className="text-green-400 text-sm">
                    {t('common.copied')}
                  </span>
                ) : (
                  <Copy className="h-5 w-5 text-zinc-400" />
                )}
              </button>
            </div>
          </div>

          {/* Share link */}
          <div className="mb-6">
            <label className="block text-zinc-400 mb-2">
              {t('share.shareLink')}
            </label>
            <div className="flex">
              <div className="flex-1 bg-zinc-800 rounded-l-lg p-3 text-sm text-zinc-400 truncate border-r border-zinc-700">
                {appLink}?ref={inviteCode}
              </div>
              <button
                onClick={() => copyToClipboard(`${appLink}?ref=${inviteCode}`)}
                className="bg-zinc-800 rounded-r-lg px-4 flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <Copy className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center justify-center bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                <Twitter className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs">Twitter</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs">Instagram</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs">More</span>
            </button>
          </div>
        </div>

        {/* Rewards info */}
        <div className="p-4 bg-zinc-800 border-t border-zinc-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
              <span className="text-pink-400">💰</span>
            </div>
            <div>
              <h4 className="font-bold">{t('share.earnCommission')}</h4>
              <p className="text-sm text-zinc-400">
                {t('share.forEachFriend')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
