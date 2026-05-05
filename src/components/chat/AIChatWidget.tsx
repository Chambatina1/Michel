'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });

      const data = await res.json();

      if (data.message) {
        const assistantMsg: ChatMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or contact us at +1 (800) 555-0199.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Connection error. Please check your network and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="h-14 w-14 rounded-full bg-teal-600 shadow-lg hover:bg-teal-700 hover:shadow-xl transition-shadow"
                aria-label="Open chat assistant"
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </Button>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-teal-500" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-primary to-primary/90 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">PS Medical AI Assistant</h3>
                    <p className="text-xs text-white/70">Always here to help</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-white/80 hover:bg-white/10 hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-1 p-4">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                          <Bot className="h-8 w-8 text-teal-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          Hi there! 👋
                        </p>
                        <p className="mt-1 max-w-[260px] text-xs text-gray-500">
                          I&apos;m your PS Medical AI assistant. Ask me about our equipment, services, or anything else.
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                          {[
                            'What equipment do you sell?',
                            'How do I sell my equipment?',
                            'Do you offer repair services?',
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => {
                                setInput(suggestion);
                                setTimeout(() => {
                                  const syntheticMsg: ChatMessage = {
                                    id: `user_${Date.now()}`,
                                    role: 'user',
                                    content: suggestion,
                                    timestamp: new Date(),
                                  };
                                  setMessages((prev) => [...prev, syntheticMsg]);
                                  setInput('');
                                  setIsTyping(true);
                                  fetch('/api/chat', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ message: suggestion, sessionId }),
                                  })
                                    .then((res) => res.json())
                                    .then((data) => {
                                      if (data.message) {
                                        setMessages((prev) => [
                                          ...prev,
                                          {
                                            id: `assistant_${Date.now()}`,
                                            role: 'assistant',
                                            content: data.message,
                                            timestamp: new Date(),
                                          },
                                        ]);
                                      }
                                    })
                                    .catch(() => {
                                      setMessages((prev) => [
                                        ...prev,
                                        {
                                          id: `error_${Date.now()}`,
                                          role: 'assistant',
                                          content: 'Sorry, something went wrong.',
                                          timestamp: new Date(),
                                        },
                                      ]);
                                    })
                                    .finally(() => setIsTyping(false));
                                }, 0);
                              }}
                              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 py-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 mt-1">
                            <Bot className="h-4 w-4 text-teal-600" />
                          </div>
                        )}
                        <div
                          className={`max-w-[260px] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-gray-100 text-gray-800 rounded-bl-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          <p
                            className={`mt-1 text-[10px] ${
                              msg.role === 'user' ? 'text-white/60' : 'text-gray-400'
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                        {msg.role === 'user' && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-1">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-2 py-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100">
                          <Bot className="h-4 w-4 text-teal-600" />
                        </div>
                        <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3">
                          <div className="flex gap-1.5">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Input Area */}
              <div className="shrink-0 border-t border-gray-200 bg-white p-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={isTyping}
                    className="h-10 flex-1 rounded-full border-gray-200 bg-gray-50 text-sm focus-visible:ring-teal-500"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isTyping}
                    className="h-10 w-10 shrink-0 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4 text-white" />
                  </Button>
                </form>
                <p className="mt-2 text-center text-[10px] text-gray-400">
                  Powered by PS Medical Devices AI
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
