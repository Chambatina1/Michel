'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Phone, User, Mail, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const WHATSAPP_DIRECT_URL = 'https://wa.me/13052449340?text=Hello!%20I%20am%20interested%20in%20PS%20Medical%20Devices%20equipment.%20Can%20you%20help%20me%3F';

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSendStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim() || !form.phone.trim() || isSending) return;

    setIsSending(true);
    setSendStatus('idle');

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSendStatus('success');
        setForm({ name: '', phone: '', email: '', subject: '', message: '' });
        // Close after 3 seconds on success
        setTimeout(() => {
          setIsOpen(false);
          setSendStatus('idle');
        }, 3000);
      } else {
        setSendStatus('error');
      }
    } catch {
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating WhatsApp Button - bottom left */}
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

                {/* Pulse indicator */}
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366]/50 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366]" />
                </span>
              </button>

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
                    <div className="absolute left-4 top-full -mt-px border-4 border-transparent border-t-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* WhatsApp Contact Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 left-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between bg-[#075E54] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <svg viewBox="0 0 32 32" fill="white" className="h-6 w-6">
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.056 31.2l6.058-1.952A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.322-5.67-1.218-4.762-1.972-7.826-6.816-8.064-7.13-.228-.314-1.928-2.568-1.928-4.896s1.22-3.474 1.652-3.95c.39-.432.902-.542 1.202-.542.15 0 .286.01.41.016.432.02.65.048.934.724.36.846 1.236 3.012 1.344 3.232.108.22.216.514.072.806-.144.294-.216.476-.432.734-.216.258-.454.576-.648.772-.216.218-.44.46-.19.902.252.442 1.118 1.844 2.4 2.988 1.648 1.47 3.038 1.924 3.48 2.14.442.216.698.18.954-.108.258-.29 1.104-1.286 1.398-1.728.294-.442.588-.36.99-.216.404.144 2.554 1.204 2.994 1.424.442.216.736.324.844.504.108.18.108 1.032-.282 2.132z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">PS Medical Devices</h3>
                    <p className="text-xs text-white/70">Usually replies within minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Close"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Success Message */}
              {sendStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center px-6 py-10">
                  <CheckCircle className="h-16 w-16 text-[#25D366] mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h4>
                  <p className="text-sm text-gray-500 text-center">We will contact you shortly via WhatsApp.</p>
                </div>
              ) : (
                <>
                  {/* Form */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
                    <p className="text-xs text-gray-500 mb-1">Send us a message and we&apos;ll reply on WhatsApp</p>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Your name"
                          value={form.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          className="h-9 pl-9 text-sm rounded-lg"
                        />
                      </div>
                      <div className="relative w-[130px]">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Your phone *"
                          value={form.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className="h-9 pl-9 text-sm rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Email (optional)"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="h-9 pl-9 text-sm rounded-lg"
                      />
                    </div>

                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Subject (optional)"
                        value={form.subject}
                        onChange={(e) => updateField('subject', e.target.value)}
                        className="h-9 pl-9 text-sm rounded-lg"
                      />
                    </div>

                    <Textarea
                      placeholder="Write your message... *"
                      value={form.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      className="min-h-[80px] text-sm rounded-lg resize-none"
                      required
                    />

                    {/* Error message */}
                    {sendStatus === 'error' && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        Could not send message. Try opening WhatsApp directly.
                      </div>
                    )}

                    {/* Send button */}
                    <Button
                      type="submit"
                      disabled={!form.message.trim() || !form.phone.trim() || isSending}
                      className="h-10 w-full rounded-lg bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-40 text-white font-medium"
                    >
                      {isSending ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send via WhatsApp
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="text-[10px] text-gray-400">or</span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  </div>

                  {/* Direct WhatsApp link */}
                  <div className="shrink-0 px-4 pb-4">
                    <a
                      href={WHATSAPP_DIRECT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-lg bg-[#128C7E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0e6b5e]"
                    >
                      <svg viewBox="0 0 32 32" fill="white" className="h-4 w-4">
                        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.052 9.38L1.056 31.2l6.058-1.952A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.31 22.598c-.39 1.1-1.932 2.014-3.17 2.28-.846.18-1.95.322-5.67-1.218-4.762-1.972-7.826-6.816-8.064-7.13-.228-.314-1.928-2.568-1.928-4.896s1.22-3.474 1.652-3.95c.39-.432.902-.542 1.202-.542.15 0 .286.01.41.016.432.02.65.048.934.724.36.846 1.236 3.012 1.344 3.232.108.22.216.514.072.806-.144.294-.216.476-.432.734-.216.258-.454.576-.648.772-.216.218-.44.46-.19.902.252.442 1.118 1.844 2.4 2.988 1.648 1.47 3.038 1.924 3.48 2.14.442.216.698.18.954-.108.258-.29 1.104-1.286 1.398-1.728.294-.442.588-.36.99-.216.404.144 2.554 1.204 2.994 1.424.442.216.736.324.844.504.108.18.108 1.032-.282 2.132z" />
                      </svg>
                      Open WhatsApp Directly
                    </a>
                  </div>
                </>
              )}

              {/* Footer */}
              <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-4 py-2">
                <p className="text-center text-[10px] text-gray-400">
                  📞 +1 (305) 244-9340 &bull; 🕐 Mon-Fri 8AM-6PM
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
