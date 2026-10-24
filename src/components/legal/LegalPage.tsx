interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <section className="gradient-primary py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-white/70">Last updated: {updated}</p>
        </div>
      </section>
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-8 px-4 sm:px-6 lg:px-8">
          {sections.map((section) => (
            <div key={section.heading} className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
