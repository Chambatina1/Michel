'use client';

import { useEffect, useState } from 'react';
import { CalendarClock, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DAY = 24 * 60 * 60 * 1000;

// Admin > Blog: the AI writes a new post every N days (see src/lib/blog-ai.ts).
export function AutoBlogSettings({ onPostCreated }: { onPostCreated: () => void }) {
  const [s, setS] = useState({ enabled: 'true', interval: '15', publish: 'true', language: 'en', topics: '', lastRun: '' });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        const v = data.settings || {};
        setS({
          enabled: v.blog_auto_enabled || 'true',
          interval: v.blog_auto_interval_days || '15',
          publish: v.blog_auto_publish || 'true',
          language: v.blog_auto_language || 'en',
          topics: v.blog_auto_topics || '',
          lastRun: v.blog_auto_last_run || '',
        });
      })
      .finally(() => setLoaded(true));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            blog_auto_enabled: s.enabled,
            blog_auto_interval_days: String(Math.max(1, parseInt(s.interval, 10) || 15)),
            blog_auto_publish: s.publish,
            blog_auto_language: s.language,
            blog_auto_topics: s.topics,
          },
        }),
      });
      if (res.ok) toast.success('Blog automatico guardado');
      else toast.error('No se pudo guardar');
    } catch {
      toast.error('No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const generateNow = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'auto-blog-now' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'No se pudo generar');
      toast.success(`Articulo creado: ${data.post.title}${data.post.isPublished ? '' : ' (borrador)'}`);
      setS((prev) => ({ ...prev, lastRun: new Date().toISOString() }));
      onPostCreated();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const interval = Math.max(1, parseInt(s.interval, 10) || 15);
  const nextRun = s.lastRun ? new Date(Date.parse(s.lastRun) + interval * DAY) : null;
  const fmt = (d: Date) => d.toLocaleDateString('es-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />Blog automatico con IA
        </CardTitle>
        {loaded && (
          <p className="text-xs text-muted-foreground">
            {s.enabled === 'false'
              ? 'Pausado.'
              : `La IA escribe un articulo nuevo cada ${interval} dias. ` +
                (s.lastRun ? `Ultimo: ${fmt(new Date(s.lastRun))}. Proximo: desde el ${fmt(nextRun!)}.` : 'El primero se crea con la proxima visita al blog o la pagina de inicio.')}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {!loaded ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <Switch checked={s.enabled !== 'false'} onCheckedChange={(v) => setS({ ...s, enabled: v ? 'true' : 'false' })} />
                <Label>Activado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={s.publish !== 'false'} onCheckedChange={(v) => setS({ ...s, publish: v ? 'true' : 'false' })} />
                <Label>{s.publish !== 'false' ? 'Publicar directamente' : 'Guardar como borrador para revisar'}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Cada</Label>
                <Input type="number" min={1} max={90} value={s.interval} onChange={(e) => setS({ ...s, interval: e.target.value })} className="h-8 w-20" />
                <Label className="text-sm">dias</Label>
              </div>
              <Select value={s.language} onValueChange={(v) => setS({ ...s, language: v })}>
                <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">Ingles</SelectItem>
                  <SelectItem value="es">Espanol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Temas (opcional, uno por linea, se usan en orden; si no hay, la IA elige uno nuevo)</Label>
              <Textarea
                rows={3}
                value={s.topics}
                onChange={(e) => setS({ ...s, topics: e.target.value })}
                placeholder={'Como elegir un C-arm reacondicionado\nMantenimiento preventivo de equipos de ultrasonido'}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={save} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar
              </Button>
              <Button variant="outline" onClick={generateNow} disabled={generating}>
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {generating ? 'Escribiendo... (hasta 1 minuto)' : 'Generar uno ahora'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
