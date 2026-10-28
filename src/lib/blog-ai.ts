import { db } from '@/lib/db';
import { completeChat } from '@/lib/ai-providers';
import { loadCompanyInfo, type CompanyInfo } from '@/lib/company';

export const NO_INVENTION =
  'Never invent facts: no statistics, prices, studies, certifications, years of experience, customer counts, warranty terms or claims about the company beyond what is given.';

export interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  tags: string; // comma-separated, like BlogPost.tags
  readTime: number;
}

export function stripFences(text: string): string {
  return text.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '').trim();
}

// Writes one blog article. With no topic, the AI picks a new one that doesn't repeat avoidTitles.
export async function generateBlogArticle(opts: {
  topic?: string;
  language?: 'en' | 'es';
  avoidTitles?: string[];
  company?: CompanyInfo;
}): Promise<GeneratedArticle> {
  const company = opts.company || (await loadCompanyInfo());
  const language = opts.language === 'es' ? 'Spanish' : 'English';
  const topicLine = opts.topic?.trim()
    ? `Topic: ${opts.topic.trim()}`
    : `Choose a new, specific, practical topic yourself. It must not repeat these existing articles:\n${(opts.avoidTitles || []).map((t) => `- ${t}`).join('\n') || '- (none yet)'}`;

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
      { role: 'user', content: topicLine },
    ],
    { temperature: 0.7, maxTokens: 3500, json: true }
  );

  let article: { title?: string; excerpt?: string; content?: string; tags?: string[]; readTime?: number };
  try {
    article = JSON.parse(stripFences(text));
  } catch {
    throw new Error('La IA devolvio un formato invalido. Intente de nuevo.');
  }
  if (!article.title || !article.content) throw new Error('La IA devolvio un articulo vacio. Intente de nuevo.');
  return {
    title: article.title,
    excerpt: article.excerpt || '',
    content: article.content,
    tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
    readTime: Number(article.readTime) || 5,
  };
}

/* ─── Automatic posts ─────────────────────────────────────────────
   Settings (Admin > Blog > Blog automatico):
   blog_auto_enabled ('true'/'false', default on), blog_auto_interval_days (default 15),
   blog_auto_publish ('true' publishes, 'false' saves as draft), blog_auto_language ('en'/'es'),
   blog_auto_topics (one topic per line, used in order, then the AI picks),
   blog_auto_last_run (ISO date, also used as a lock so only one request generates). */

const DAY = 24 * 60 * 60 * 1000;

const BLOG_IMAGES: Array<[RegExp, string]> = [
  [/ophthalm|oct\b|retina|slit|eye/i, '/images/blog/ophthalmology-tech.jpg'],
  [/ultrasound|sonograph|probe|transducer/i, '/images/blog/portable-ultrasound.jpg'],
  [/\bct\b|computed tomography|scanner/i, '/images/blog/ct-technology-2025.jpg'],
  [/\bai\b|artificial intelligence|software/i, '/images/blog/ai-medical-imaging.jpg'],
  [/mri|magnetic/i, '/images/blog/ai-diagnostics-brain.jpg'],
];

const PRODUCT_KEYWORDS = ['ultrasound', 'CT', 'MRI', 'X-Ray', 'Mammo', 'C-Arm', 'OCT', 'Slit', 'Retinal', 'Visual Field', 'Tonometer', 'DXA'];

// Picks a cover photo: a matching product from the catalog, else a stock blog image.
async function pickCoverImage(title: string): Promise<string> {
  for (const keyword of PRODUCT_KEYWORDS) {
    if (!new RegExp(`\\b${keyword}`, 'i').test(title)) continue;
    try {
      const product = await db.product.findFirst({
        where: {
          status: 'active',
          imageUrl: { not: '' },
          OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { category: { contains: keyword, mode: 'insensitive' } }],
        },
        orderBy: { isFeatured: 'desc' },
      });
      if (product?.imageUrl) return product.imageUrl;
    } catch {
      // fall through to the stock images
    }
  }
  return BLOG_IMAGES.find(([re]) => re.test(title))?.[1] || '/images/hero-banner.jpg';
}

async function uniqueSlug(title: string): Promise<string> {
  const base = title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80) || 'post';
  let slug = base;
  for (let i = 2; await db.blogPost.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`;
  return slug;
}

async function getSettings(): Promise<Record<string, string>> {
  const rows = await db.siteSettings.findMany({ where: { key: { startsWith: 'blog_auto_' } } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

async function setSetting(key: string, value: string) {
  await db.siteSettings.upsert({ where: { key }, update: { value }, create: { key, value } });
}

// Takes the run lock by moving blog_auto_last_run from `previous` to `next`. Only one caller wins.
async function claimRun(previous: string | undefined, next: string): Promise<boolean> {
  if (previous === undefined) {
    try {
      await db.siteSettings.create({ data: { key: 'blog_auto_last_run', value: next } });
      return true;
    } catch {
      return false; // another request created it first
    }
  }
  const { count } = await db.siteSettings.updateMany({ where: { key: 'blog_auto_last_run', value: previous }, data: { value: next } });
  return count === 1;
}

// Writes and saves the next automatic post. Returns the new post's title and slug.
export async function runAutoBlog(settings?: Record<string, string>) {
  const s = settings || (await getSettings());
  const topics = (s.blog_auto_topics || '').split('\n').map((t) => t.trim()).filter(Boolean);
  const existing = await db.blogPost.findMany({ select: { title: true }, orderBy: { createdAt: 'desc' }, take: 60 });
  const existingTitles = existing.map((p) => p.title);
  // Next listed topic that hasn't been used yet
  const used = new Set((s.blog_auto_topics_used || '').split('\n').filter(Boolean));
  const topic = topics.find((t) => !used.has(t));

  const article = await generateBlogArticle({
    topic,
    language: s.blog_auto_language === 'es' ? 'es' : 'en',
    avoidTitles: existingTitles,
  });
  const post = await db.blogPost.create({
    data: {
      title: article.title,
      slug: await uniqueSlug(article.title),
      excerpt: article.excerpt,
      content: article.content,
      tags: article.tags,
      readTime: article.readTime,
      coverImage: await pickCoverImage(`${topic || ''} ${article.title}`),
      category: 'Industry News',
      isPublished: s.blog_auto_publish !== 'false',
    },
  });
  if (topic) await setSetting('blog_auto_topics_used', [...used, topic].join('\n'));
  await setSetting('blog_auto_last_run', new Date().toISOString());
  console.log(`Auto blog: created "${post.title}" (${post.isPublished ? 'published' : 'draft'})`);
  return { title: post.title, slug: post.slug, isPublished: post.isPublished };
}

let checking = false;

// Called from public blog requests: writes a post when the interval has passed. Never throws.
export async function maybeRunAutoBlog(): Promise<void> {
  if (checking) return;
  checking = true;
  try {
    const s = await getSettings();
    if (s.blog_auto_enabled === 'false') return;
    const intervalDays = Math.max(1, parseInt(s.blog_auto_interval_days || '15', 10) || 15);
    const previous = s.blog_auto_last_run;
    const lastRun = previous ? Date.parse(previous) : 0;
    if (Date.now() - (lastRun || 0) < intervalDays * DAY) return;
    if (!(await claimRun(previous, new Date().toISOString()))) return;
    try {
      await runAutoBlog(s);
    } catch (error) {
      console.error('Auto blog failed:', error);
      // Try again in about a day instead of waiting a full interval
      await setSetting('blog_auto_last_run', new Date(Date.now() - (intervalDays - 1) * DAY).toISOString());
    }
  } catch (error) {
    console.error('Auto blog check failed:', error);
  } finally {
    checking = false;
  }
}
