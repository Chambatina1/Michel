'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Phone } from 'lucide-react';

const WHATSAPP_NUMBER = '13052449340';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hello P&S Medical Device Inc.! I would like more information about your equipment.'
)}`;

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {/* Floating Button - bottom left */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsOpen(true)}
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all hover:bg-[#20bd5a] hover:shadow-xl hover:scale-110 active:scale-95"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Contact us on WhatsApp"
              >
                <svg viewBox="0 0 32 32" fill="white" className="h-7 w-7">
                  <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.056 31.2l6.058-1.952A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.322-5.67-1.218-4.762-1.972-7.826-6.816-8.064-7.13-.228-.314-1.928-2.568-1.928-4.896s1.22-3.474 1.652-3.95c.39-.432.902-.542 1.202-.542.15 0 .286.01.41.016.432.02.65.048.934.724.36.846 1.236 3.012 1.344 3.232.108.22.216.514.072.806-.144.294-.216.476-.432.734-.216.258-.454.576-.648.772-.216.218-.44.46-.19.902.252.442 1.118 1.844 2.4 2.988 1.648 1.47 3.038 1.924 3.48 2.14.442.216.698.18.954-.108.258-.29 1.104-1.286 1.398-1.728.294-.442.588-.36.99-.216.404.144 2.554 1.204 2.994 1.424.442.216.736.324.844.504.108.18.108 1.032-.282 2.132z" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366]/50 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366]" />
                </span>
              </button>

              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, y: 5 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -10, y: 5 }}
                    className="absolute bottom-full left-0 mb-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#25D366]" />
                      Chat on WhatsApp
                    </div>
                    <div className="absolute left-4 top-full -mt-px border-4 border-transparent border-t-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* WhatsApp Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 left-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex w-[340px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between bg-[#075E54] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <svg viewBox="0 0 32 32" fill="white" className="h-6 w-6">
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.056 31.2l6.058-1.952A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.322-5.67-1.218-4.762-1.972-7.826-6.816-8.064-7.13-.228-.314-1.928-2.568-1.928-4.896s1.22-3.474 1.652-3.95c.39-.432.902-.542 1.202-.542.15 0 .286.01.41.016.432.02.65.048.934.724.36.846 1.236 3.012 1.344 3.232.108.22.216.514.072.806-.144.294-.216.476-.432.734-.216.258-.454.576-.648.772-.216.218-.44.46-.19.902.252.442 1.118 1.844 2.4 2.988 1.648 1.47 3.038 1.924 3.48 2.14.442.216.698.18.954-.108.258-.29 1.104-1.286 1.398-1.728.294-.442.588-.36.99-.216.404.144 2.554 1.204 2.994 1.424.442.216.736.324.844.504.108.18.108 1.032-.282 2.132z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">P&S Medical Device Inc.</h3>
                    <p className="flex items-center gap-1.5 text-xs text-white/70">
                      <span className="inline-block h-2 w-2 rounded-full bg-[#25D366]" />
                      Online now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                {/* Chat bubble */}
                <div className="rounded-2xl rounded-tl-sm bg-[#DCF8C6] px-4 py-3">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    Hello! Welcome to <strong>P&S Medical Device Inc.</strong>. How can we help you today?
                  </p>
                  <p className="mt-1 text-right text-[10px] text-gray-400">P&S Medical Device Inc.</p>
                </div>

                {/* Quick action buttons */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick actions:</p>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I need a quote for medical equipment')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-all hover:border-[#25D366]/30 hover:bg-[#25D366]/5 hover:shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Request a Quote</p>
                      <p className="text-xs text-gray-500">Get pricing for equipment</p>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I want to sell my used medical equipment')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-all hover:border-[#25D366]/30 hover:bg-[#25D366]/5 hover:shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sell Your Equipment</p>
                      <p className="text-xs text-gray-500">Get a fair offer today</p>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('I need repair or maintenance service')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-all hover:border-[#25D366]/30 hover:bg-[#25D366]/5 hover:shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Repair & Maintenance</p>
                      <p className="text-xs text-gray-500">Expert service requests</p>
                    </div>
                  </a>
                </div>

                {/* Start chat button */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#20bd5a] hover:shadow-lg active:scale-[0.98]"
                >
                  <svg viewBox="0 0 32 32" fill="white" className="h-5 w-5">
                    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.056 31.2l6.058-1.952A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.322-5.67-1.218-4.762-1.972-7.826-6.816-8.064-7.13-.228-.314-1.928-2.568-1.928-4.896s1.22-3.474 1.652-3.95c.39-.432.902-.542 1.202-.542.15 0 .286.01.41.016.432.02.65.048.934.724.36.846 1.236 3.012 1.344 3.232.108.22.216.514.072.806-.144.294-.216.476-.432.734-.216.258-.454.576-.648.772-.216.218-.44.46-.19.902.252.442 1.118 1.844 2.4 2.988 1.648 1.47 3.038 1.924 3.48 2.14.442.216.698.18.954-.108.258-.29 1.104-1.286 1.398-1.728.294-.442.588-.36.99-.216.404.144 2.554 1.204 2.994 1.424.442.216.736.324.844.504.108.18.108 1.032-.282 2.132z" />
                  </svg>
                  Start WhatsApp Chat
                </a>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-5 py-3">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    +1 (305) 244-9340
                  </span>
                  <span>&bull;</span>
                  <span>Mon-Fri 8AM-6PM</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
