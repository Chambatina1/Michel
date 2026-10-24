"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

// Renders admin-written text (Markdown) keeping paragraphs, line breaks, headings,
// lists, tables, images and links. Tailwind's typography plugin isn't installed,
// so every element is styled here explicitly.
const components: Components = {
  h1: ({ children }) => <h2 className="mt-8 mb-3 text-2xl font-bold text-foreground">{children}</h2>,
  h2: ({ children }) => <h2 className="mt-8 mb-3 text-xl font-bold text-foreground sm:text-2xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 text-lg font-semibold text-foreground">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-4 mb-2 font-semibold text-foreground">{children}</h4>,
  p: ({ children }) => <p className="my-3 leading-relaxed text-muted-foreground">{children}</p>,
  ul: ({ children }) => <ul className="my-3 ml-5 list-disc space-y-1 text-muted-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 ml-5 list-decimal space-y-1 text-muted-foreground">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline-offset-2 hover:underline"
      {...(href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 rounded-r-lg border-l-4 border-primary/30 bg-primary/5 py-1 pl-4 pr-4">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="my-4 w-full overflow-x-auto">
      <table className="w-full border-collapse border text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border bg-secondary px-3 py-2 text-left font-semibold text-foreground">{children}</th>,
  td: ({ children }) => <td className="border px-3 py-2 align-top text-muted-foreground">{children}</td>,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : ""} alt={alt || ""} className="my-4 h-auto max-w-full rounded-xl shadow-md" loading="lazy" />
  ),
  hr: () => <hr className="my-6 border-border" />,
  code: ({ children }) => <code className="rounded bg-secondary px-1 py-0.5 text-sm">{children}</code>,
};

// A single Enter in the admin textarea should show as a line break, like in Word.
function keepLineBreaks(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/([^\n])\n(?!\n)/g, "$1  \n");
}

export function RichText({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("break-words", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {keepLineBreaks(content || "")}
      </ReactMarkdown>
    </div>
  );
}
