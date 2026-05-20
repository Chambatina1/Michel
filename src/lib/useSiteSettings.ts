"use client";
import { useState, useEffect } from 'react';

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data.settings || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { settings, loading };
}

export function getSetting(settings: Record<string, string>, key: string, fallback: string = ''): string {
  return settings[key]?.trim() || fallback;
}
