import { NextRequest, NextResponse } from 'next/server';
import { completeChat } from '@/lib/ai-providers';
import { loadCompanyInfo } from '@/lib/company';

// Admin-only (src/proxy.ts guards /api/admin/*): AI writing helpers for the admin panel.
//   { mode: 'blog', topic, language? }            -> { title, excerpt, content, tags, readTime }
//   { mode: 'product', name, description }        -> { description }  (same facts, Markdown layout)

const NO_INVENTION =
  'Never invent facts: no statistics, prices, studies, certifications, years of experience, customer counts, warranty terms or claims about the company beyond what is given.';

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
      const language = body.language === 'es' ? 'Spanish' : 'English';
      if (!topic) {
        return NextResponse.json({ error: 'Escriba el tema del articulo.' }, { status: 400 });
      }
      const { text } = await completeChat(
        [
          {
            role: 'system',
            content: `You write blog articles for the website of ${company.name}, a company in ${company.address} that buys, sells, refurbishes and services medical imaging and ophthalmology equipment (CT, MRI, X-ray, ultrasound, mammography, C-arm, OCT, slit lamps and parts).
Write a helpful, practical article for clinic owners, hospital purchasing teams and biomedical engineers, written in ${language}.
${NO_INVENTION} Prefer practical guidance (how to choose, what to check, maintenance tips, questions to ask) over news.
Format the content as Markdown: an intro paragraph, 4-6 "## " sections, bullet lists where useful, **bold** for key terms, and a short closing paragraph inviting readers to contact ${company.name} for a quote or to browse the catalog at /catalog. Do not start the content with a "# " title. About 700-1000 words.
Reply ONLY with a JSON object: {"title": string, "excerpt": string (1-2 sentences, max 200 characters), "content": string (the Markdown), "tags": string[] (4-6 short tags), "readTime": number (minutes)}.`,
          },
          { role: 'user', content: `Topic: ${topic}` },
        ],
        { temperature: 0.7, maxTokens: 3500, json: true }
      );
      let article: { title?: string; excerpt?: string; content?: string; tags?: string[]; readTime?: number };
      try {
        article = JSON.parse(stripFences(text));
      } catch {
        return NextResponse.json({ error: 'La IA devolvio un formato invalido. Intente de nuevo.' }, { status: 502 });
      }
      return NextResponse.json({
        title: article.title || topic,
        excerpt: article.excerpt || '',
        content: article.content || '',
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
        readTime: Number(article.readTime) || 5,
      });
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

function stripFences(text: string): string {
  return text.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '').trim();
}
