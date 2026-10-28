'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Images, Loader2, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { sortByCarouselOrder } from '@/components/layout/FeaturedCarousel';

interface CarouselProduct {
  id: string;
  name: string;
  status: string;
  isFeatured: boolean;
  imageUrl: string;
  price: number | null;
}

interface Props<T extends CarouselProduct> {
  products: T[];
  onToggleFeatured: (product: T) => Promise<void> | void;
}

// Admin > Carrusel: picks which products appear in the home page carousel (the featured ones) and their order.
export function CarouselManager<T extends CarouselProduct>({ products, onToggleFeatured }: Props<T>) {
  const [settings, setSettings] = useState({ enabled: 'true', title: '', subtitle: '', order: '' });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        const s = data.settings || {};
        setSettings({
          enabled: s.home_carousel_enabled || 'true',
          title: s.home_carousel_title || '',
          subtitle: s.home_carousel_subtitle || '',
          order: s.home_carousel_order || '',
        });
      })
      .finally(() => setLoaded(true));
  }, []);

  const inCarousel = useMemo(
    () => sortByCarouselOrder(products.filter((p) => p.isFeatured), settings.order),
    [products, settings.order]
  );
  const candidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => !p.isFeatured && p.status === 'active' && p.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [products, search]);

  const save = async (next = settings) => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            home_carousel_enabled: next.enabled,
            home_carousel_title: next.title,
            home_carousel_subtitle: next.subtitle,
            home_carousel_order: next.order,
          },
        }),
      });
      if (res.ok) toast.success('Carrusel guardado');
      else toast.error('No se pudo guardar el carrusel');
    } catch {
      toast.error('No se pudo guardar el carrusel');
    } finally {
      setSaving(false);
    }
  };

  const move = (index: number, delta: number) => {
    const ids = inCarousel.map((p) => p.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    const next = { ...settings, order: ids.join(',') };
    setSettings(next);
    save(next);
  };

  const toggle = async (product: T) => {
    setBusyId(product.id);
    try {
      await onToggleFeatured(product);
      if (!product.isFeatured) setSearch('');
    } finally {
      setBusyId('');
    }
  };

  const hidden = inCarousel.filter((p) => p.status !== 'active' || !p.imageUrl);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Carrusel de la pagina de inicio</h3>
        <p className="text-sm text-gray-500">
          Los equipos destacados (estrella) se muestran en un carrusel debajo del video de inicio. Aqui puede agregarlos, quitarlos y ordenarlos.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Textos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!loaded ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.enabled !== 'false'}
                  onCheckedChange={(v) => setSettings({ ...settings, enabled: v ? 'true' : 'false' })}
                />
                <Label>Mostrar el carrusel en la pagina de inicio</Label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Titulo</Label>
                  <Input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} placeholder="Featured Equipment" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Subtitulo</Label>
                  <Input value={settings.subtitle} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} placeholder="Selected units from our current inventory" />
                </div>
              </div>
              <Button onClick={() => save()} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Images className="h-4 w-4" />En el carrusel ({inCarousel.length})
            <a href="/" target="_blank" rel="noopener noreferrer" className="ml-1 text-xs font-normal text-teal-600 hover:underline inline-flex items-center gap-1">
              Ver inicio <ExternalLink className="h-3 w-3" />
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar un equipo para agregarlo..." className="pl-9" />
            {candidates.length > 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow-lg">
                {candidates.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p)}
                    disabled={busyId !== ''}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-8 w-10 rounded object-cover" /> : <div className="h-8 w-10 rounded bg-gray-100" />}
                    <span className="flex-1 truncate">{p.name}</span>
                    <Plus className="h-4 w-4 text-teal-600" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {hidden.length > 0 && (
            <p className="text-xs text-amber-600">
              {hidden.length} destacado(s) no se muestran porque estan ocultos, vendidos o sin imagen.
            </p>
          )}

          {inCarousel.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">Ningun equipo en el carrusel. Busque uno arriba para agregarlo.</p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {inCarousel.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3 p-2">
                  <span className="w-5 text-center text-xs text-gray-400">{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-10 w-14 rounded object-cover" /> : <div className="h-10 w-14 rounded bg-gray-100" />}
                  <span className={`flex-1 truncate text-sm ${p.status !== 'active' || !p.imageUrl ? 'text-gray-400 line-through' : ''}`}>{p.name}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(i, -1)} disabled={i === 0 || saving} title="Subir">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(i, 1)} disabled={i === inCarousel.length - 1 || saving} title="Bajar">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => toggle(p)} disabled={busyId !== ''} title="Quitar del carrusel">
                    {busyId === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
