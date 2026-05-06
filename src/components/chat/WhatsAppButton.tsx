'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '13052449340'; // +1 (305) 244-9340
const DEFAULT_MESSAGE = 'Hello! I am interested in PS Medical Devices equipment. Can you help me?';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Floating WhatsApp Button - bottom left */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all hover:bg-[#20bd5a] hover:shadow-xl hover:scale-110 active:scale-95"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Contact us on WhatsApp"
        >
          <svg
            viewBox="0 0 32 32"
            fill="white"
            className="h-7 w-7"
          >
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.056 31.2l6.058-1.952A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.322-5.67-1.218-4.762-1.972-7.826-6.816-8.064-7.13-.228-.314-1.928-2.568-1.928-4.896s1.22-3.474 1.652-3.95c.39-.432.902-.542 1.202-.542.15 0 .286.01.41.016.432.02.65.048.934.724.36.846 1.236 3.012 1.344 3.232.108.22.216.514.072.806-.144.294-.216.476-.432.734-.216.258-.454.576-.648.772-.216.218-.44.46-.19.902.252.442 1.118 1.844 2.4 2.988 1.648 1.47 3.038 1.924 3.48 2.14.442.216.698.18.954-.108.258-.29 1.104-1.286 1.398-1.728.294-.442.588-.36.99-.216.404.144 2.554 1.204 2.994 1.424.442.216.736.324.844.504.108.18.108 1.032-.282 2.132z" />
          </svg>

          {/* Pulse indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366]/50 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366]" />
          </span>
        </motion.a>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -10, y: 5 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -10, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-0 mb-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-lg"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                Chat on WhatsApp
              </div>
              {/* Tooltip arrow */}
              <div className="absolute left-4 top-full -mt-px border-4 border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
