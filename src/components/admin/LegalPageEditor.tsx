'use client';

import { useState } from 'react';
import { Eye, FileText, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichText } from '@/components/RichText';
import type { LegalPageDef } from '@/lib/legal-drafts';

interface Props {
  page: LegalPageDef;
  settings: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

// Editor for one legal page (Admin > Configuracion > Paginas Legales).
export function LegalPageEditor({ page, settings, onChange }: Props) {
  const [preview, setPreview] = useState(false);
  const titleKey = `${page.key}_title`;
  const contentKey = `${page.key}_content`;
  const updatedKey = `${page.key}_updated`;
  const content = settings[contentKey] || '';

  const loadDraft = () => {
    if (content.trim() && !window.confirm('El editor ya tiene texto. ¿Reemplazarlo por el borrador sugerido?')) return;
    onChange(contentKey, page.draft);
    setPreview(false);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {page.adminLabel}
            <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs font-normal text-teal-600 hover:underline">
              /{page.slug}
            </a>
          </CardTitle>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={loadDraft}>Cargar borrador</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setPreview((p) => !p)}>
              {preview ? <><Pencil className="mr-1.5 h-3.5 w-3.5" />Editar</> : <><Eye className="mr-1.5 h-3.5 w-3.5" />Vista previa</>}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {content.trim() ? 'Publicada al guardar.' : 'Sin texto: el sitio muestra un aviso con sus datos de contacto.'}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs">Titulo</Label>
            <Input value={settings[titleKey] || ''} onChange={(e) => onChange(titleKey, e.target.value)} placeholder={page.defaultTitle} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Fecha de ultima actualizacion (se muestra en la pagina)</Label>
            <Input type="date" value={settings[updatedKey] || ''} onChange={(e) => onChange(updatedKey, e.target.value)} />
          </div>
        </div>
        {preview ? (
          <div className="max-h-[480px] overflow-y-auto rounded-lg border p-4">
            {content.trim() ? <RichText content={content} /> : <p className="text-sm text-muted-foreground">Sin contenido.</p>}
          </div>
        ) : (
          <div className="space-y-1">
            <Label className="text-xs">Contenido</Label>
            <Textarea value={content} onChange={(e) => onChange(contentKey, e.target.value)} rows={14} className="font-mono text-xs" />
            <p className="text-[11px] text-muted-foreground">
              Formato: <code>## Titulo</code> para secciones, <code>**negrita**</code>, <code>- </code> para listas, <code>[texto](https://enlace)</code> para enlaces. Una linea en blanco separa parrafos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
