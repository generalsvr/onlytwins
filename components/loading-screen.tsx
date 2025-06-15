'use client';

import { motion } from 'framer-motion';
import SafeImage from './safe-image';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="relative w-40 h-32">
        <SafeImage
          src="/pink-lips-logo.png"
          alt="OnlyTwins Logo"
          fill
          className="object-contain"
          fallbackSrc="/placeholder.svg?key=tsne3"
        />
      </div>
      <motion.div
        className="mt-8 h-1 w-48 bg-zinc-800 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>
      <motion.p
        className="mt-4 text-zinc-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
