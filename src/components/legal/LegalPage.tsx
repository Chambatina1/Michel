"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { RichText } from "@/components/RichText";
import { useSiteSettings, getSetting } from "@/lib/useSiteSettings";
import { getCompanyInfo } from "@/lib/company";
import { getLegalPage, type LegalPageDef } from "@/lib/legal-drafts";

// Public legal page whose text is edited in Admin > Paginas Legales.
// Nothing is published until the company saves approved text there.
export function LegalPage({ slug }: { slug: LegalPageDef["slug"] }) {
  const page = getLegalPage(slug);
  const { settings, loading } = useSiteSettings();
  const company = getCompanyInfo(settings);
  const title = getSetting(settings, `${page.key}_title`, page.defaultTitle);
  const content = getSetting(settings, `${page.key}_content`);
  const updated = getSetting(settings, `${page.key}_updated`);

  return (
    <>
      <section className="gradient-primary py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FileText className="mx-auto mb-3 h-10 w-10 text-white/80" />
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          {updated && <p className="mt-3 text-sm text-white/70">Last updated: {updated}</p>}
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-secondary" />
              ))}
            </div>
          ) : content ? (
            <RichText content={content} />
          ) : (
            <div className="rounded-xl border bg-secondary/30 p-6 text-center">
              <p className="text-muted-foreground">
                This policy is being updated. For any question, please contact {company.name} at{" "}
                <a href={`mailto:${company.email}`} className="text-primary hover:underline">{company.email}</a> or{" "}
                <a href={`tel:${company.phone.replace(/[^+\d]/g, "")}`} className="text-primary hover:underline">{company.phone}</a>.
              </p>
              <Link href="/contact" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                Contact us
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
