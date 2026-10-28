import { NextRequest, NextResponse } from 'next/server';
import { completeChat } from '@/lib/ai-providers';
import { loadCompanyInfo } from '@/lib/company';
import { generateBlogArticle, NO_INVENTION, runAutoBlog, stripFences } from '@/lib/blog-ai';

// Admin-only (src/proxy.ts guards /api/admin/*): AI writing helpers for the admin panel.
//   { mode: 'blog', topic, language? }            -> { title, excerpt, content, tags, readTime }
//   { mode: 'product', name, description }        -> { description }  (same facts, Markdown layout)
//   { mode: 'auto-blog-now' }                     -> { post }  (writes and saves the next automatic post)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const company = await loadCompanyInfo();

    if (body.mode === 'product') {
      const name = String(body.name || '').trim();
      const description = String(body.description || '').trim();
      if (!description) {
        return NextResponse.json({ error: 'Escriba o pegue primero una descripcion.' }, { status: 400 });
      }
      const { text } = await completeChat(
        [
          {
            role: 'system',
            content: `You format medical equipment listings for the online store of ${company.name}. Rewrite the seller's raw description into clean, well-organized Markdown for a product page.
Rules:
- Keep EVERY fact from the original (models, years, probes, included items, condition, licenses, warranty if stated). Do not add facts. ${NO_INVENTION}
- Write in the same language as the original.
- Start with a 1-2 sentence overview paragraph (no heading, do not repeat the product name as a title).
- Then use "## " section headings such as What's Included, Key Features, Specifications, Condition, as they apply.
- Use "- " bullet lists for items and features. For label/value details use bullets like "- **Model:** Vivid iQ".
- Remove contact lines, emails, phone numbers, website URLs, "FOR SALE" banners and calls to action: the page already has buttons for that.
- Output only the Markdown, without code fences.`,
          },
          { role: 'user', content: `Product name: ${name || '(not given)'}\n\nRaw description:\n${description}` },
        ],
        { temperature: 0.3, maxTokens: 1800 }
      );
      return NextResponse.json({ description: stripFences(text) });
    }

    if (body.mode === 'blog') {
      const topic = String(body.topic || '').trim();
      if (!topic) {
        return NextResponse.json({ error: 'Escriba el tema del articulo.' }, { status: 400 });
      }
      const article = await generateBlogArticle({ topic, language: body.language === 'es' ? 'es' : 'en', company });
      return NextResponse.json(article);
    }

    // Writes and saves the next automatic post right away (Admin > Blog > Blog automatico)
    if (body.mode === 'auto-blog-now') {
      const post = await runAutoBlog();
      return NextResponse.json({ post });
    }

    return NextResponse.json({ error: 'Modo no valido' }, { status: 400 });
  } catch (error) {
    console.error('Admin AI error:', error);
    return NextResponse.json(
      { error: `No se pudo generar con IA: ${(error as Error).message}` },
      { status: 502 }
    );
  }
}
