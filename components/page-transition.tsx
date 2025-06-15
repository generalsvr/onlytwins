'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  id: string;
}

export default function PageTransition({ children, id }: PageTransitionProps) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 h-full w-full"
    >
      {children}
    </motion.div>
  );
}
