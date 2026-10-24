"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Map } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

const sections: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Main pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Equipment", href: "/catalog" },
      { label: "Parts & Accessories", href: "/parts-accessories" },
      { label: "Services", href: "/services" },
      { label: "Sell Equipment", href: "/sell-equipment" },
      { label: "Blog", href: "/blog" },
      { label: "Reviews", href: "/reviews" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Return & Warranty Policy", href: "/returns" },
    ],
  },
];

export default function SitemapPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data?.categories) ? data.categories : []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <>
      <section className="gradient-primary py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Map className="mx-auto mb-3 h-10 w-10 text-white/80" />
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Sitemap</h1>
        </div>
      </section>
      <section className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-4xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 text-lg font-semibold text-foreground">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {categories.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">Equipment categories</h2>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/catalog?parentCategory=${encodeURIComponent(cat.name)}`} className="text-sm text-muted-foreground hover:text-primary">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
