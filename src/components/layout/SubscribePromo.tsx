'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Loader2, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSiteSettings, getSetting } from '@/lib/useSiteSettings';

// Shared with the checkout page so a subscriber's code is prefilled there
export const PROMO_CODE_STORAGE_KEY = 'ps_promo_code';
const POPUP_SEEN_KEY = 'ps_promo_popup_seen';
const BAR_DISMISSED_KEY = 'ps_promo_bar_dismissed';

const DEFAULTS = {
  percent: '5',
  barText: 'Subscribe & save 5% on parts and accessories',
  title: 'Subscribe & save 5% on parts and accessories',
  subtitle: 'Your one-time code - parts & accessories only (equipment excluded)',
  buttonText: 'Get my 5% code',
  successText: 'Use this code at checkout. Valid once, on parts & accessories only.',
  delay: '8',
};

function readStorage(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode); the promo still works for this visit
  }
}

function useSubscribe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState<string | null>(null);

  const subscribe = async (name: string, email: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return null;
      }
      if (data.alreadyUsed) {
        setError('This email already used its discount code.');
        return null;
      }
      setCode(data.code);
      writeStorage(PROMO_CODE_STORAGE_KEY, data.code);
      writeStorage(POPUP_SEEN_KEY, '1');
      return data.code as string;
    } catch {
      setError('Something went wrong. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, code, subscribe };
}

function CodeDisplay({ code, text }: { code: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; the code is still visible to copy by hand
    }
  };
  return (
    <div className="space-y-3 text-center">
      <button
        type="button"
        onClick={copy}
        className="mx-auto flex items-center gap-3 rounded-lg border-2 border-dashed border-teal-500 bg-teal-50 px-5 py-3 font-mono text-xl font-bold tracking-wider text-teal-700 dark:bg-teal-950 dark:text-teal-300"
      >
        {code}
        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
      </button>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function SubscribePromo() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [barVisible, setBarVisible] = useState(false);
  const [popupName, setPopupName] = useState('');
  const [popupEmail, setPopupEmail] = useState('');
  const [barName, setBarName] = useState('');
  const [barEmail, setBarEmail] = useState('');
  const { loading, error, code, subscribe } = useSubscribe();

  const percent = getSetting(settings, 'promo_percent', DEFAULTS.percent);
  const enabled = getSetting(settings, 'promo_enabled', 'true') !== 'false' && parseFloat(percent) > 0;
  const barText = getSetting(settings, 'promo_bar_text', DEFAULTS.barText);
  const title = getSetting(settings, 'promo_title', DEFAULTS.title);
  const subtitle = getSetting(settings, 'promo_subtitle', DEFAULTS.subtitle);
  const buttonText = getSetting(settings, 'promo_button_text', DEFAULTS.buttonText);
  const successText = getSetting(settings, 'promo_success_text', DEFAULTS.successText);
  const delaySeconds = parseFloat(getSetting(settings, 'promo_popup_delay', DEFAULTS.delay)) || 0;

  useEffect(() => {
    if (settingsLoading || !enabled) return;
    const alreadySubscribed = !!readStorage(PROMO_CODE_STORAGE_KEY);
    setBarVisible(!alreadySubscribed && !readStorage(BAR_DISMISSED_KEY));
    if (alreadySubscribed || readStorage(POPUP_SEEN_KEY)) return;
    const timer = setTimeout(() => {
      setOpen(true);
      writeStorage(POPUP_SEEN_KEY, '1');
    }, delaySeconds * 1000);
    return () => clearTimeout(timer);
  }, [settingsLoading, enabled, delaySeconds]);

  if (settingsLoading || !enabled) return null;

  const dismissBar = () => {
    setBarVisible(false);
    writeStorage(BAR_DISMISSED_KEY, '1');
  };

  const submitBar = async (e: React.FormEvent) => {
    e.preventDefault();
    // The popup shows the code, or the error with the fields prefilled
    setPopupName(barName);
    setPopupEmail(barEmail);
    if (await subscribe(barName.trim(), barEmail.trim())) setBarVisible(false);
    setOpen(true);
  };

  const submitPopup = async (e: React.FormEvent) => {
    e.preventDefault();
    await subscribe(popupName.trim(), popupEmail.trim());
  };

  return (
    <>
      {barVisible && (
        <div className="relative bg-[#1a2a5e] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2 sm:px-12">
            <Tag className="hidden h-4 w-4 shrink-0 text-teal-300 sm:block" />
            <p className="text-sm font-semibold">{barText}</p>
            <form onSubmit={submitBar} className="hidden items-center gap-2 lg:flex">
              <Input
                value={barName}
                onChange={(e) => setBarName(e.target.value)}
                placeholder="First Name"
                required
                className="h-8 w-36 border-white/20 bg-white text-sm text-gray-900"
              />
              <Input
                type="email"
                value={barEmail}
                onChange={(e) => setBarEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-8 w-48 border-white/20 bg-white text-sm text-gray-900"
              />
              <Button type="submit" size="sm" disabled={loading} className="h-8 bg-teal-600 hover:bg-teal-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
              </Button>
            </form>
            <Button
              type="button"
              size="sm"
              onClick={() => setOpen(true)}
              className="h-7 shrink-0 bg-teal-600 px-3 text-xs hover:bg-teal-700 lg:hidden"
            >
              Get code
            </Button>
          </div>
          <button
            type="button"
            onClick={dismissBar}
            aria-label="Close"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-2xl font-bold leading-snug">{code ? 'Here is your code!' : title}</DialogTitle>
            {!code && <DialogDescription className="text-base">{subtitle}</DialogDescription>}
          </DialogHeader>
          {code ? (
            <CodeDisplay code={code} text={successText} />
          ) : (
            <form onSubmit={submitPopup} className="space-y-3">
              <Input value={popupName} onChange={(e) => setPopupName(e.target.value)} placeholder="First Name" required />
              <Input
                type="email"
                value={popupEmail}
                onChange={(e) => setPopupEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading} className="h-11 w-full bg-teal-600 text-base hover:bg-teal-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
