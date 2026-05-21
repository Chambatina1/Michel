"use client";

import { useState, useEffect } from "react";
import { Wrench, Package, Cpu, Cable, Zap, CircleDot, Search, ArrowRight, Eye, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LeadForm } from "@/components/layout/LeadForm";

/* ── Icon mapping for dynamic parts subcategories ── */
const PARTS_ICON_MAP: Record<string, React.ElementType> = {
  'coil': Cpu,
  'tube': CircleDot,
  'probe': Package,
  'lens': Eye,
  'cable': Cable,
  'power': Zap,
  'ophthalmology': Wrench,
  'connector': Cable,
  'supply': Zap,
  'detector': CircleDot,
  'bulb': Zap,
  'battery': Zap,
  'board': Cpu,
  'motor': Cpu,
  'pump': Package,
  'filter': Package,
  'printer': Package,
  'sensor': Cpu,
  'electrode': Cable,
  'transducer': Package,
};

function getIconForPart(name: string): React.ElementType {
  const key = name.toLowerCase().trim();
  for (const [k, icon] of Object.entries(PARTS_ICON_MAP)) {
    if (key.includes(k)) return icon;
  }
  return Wrench;
}

interface SubcategoryWithCount {
  name: string;
  count: number;
}

interface Category {
  id: string;
  name: string;
  subcategories: string;
  subcategoriesList: SubcategoryWithCount[];
}

export default function PartsAccessoriesPage() {
  const [partsCategory, setPartsCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        const cats: Category[] = data.categories || [];
        // Find the Parts & Accessories category
        const parts = cats.find(c => {
          const n = c.name.toLowerCase();
          return n.includes('part') || n.includes('accessory');
        });
        setPartsCategory(parts || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Parts & Accessories
          </h1>
          <p className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto">
            Find replacement parts, accessories, and components for your medical imaging and ophthalmology equipment
          </p>
        </div>
      </section>

      {/* Categories Grid — Dynamic from API */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : partsCategory && (partsCategory.subcategoriesList || []).length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(partsCategory.subcategoriesList || []).map((sub) => {
                const PartIcon = getIconForPart(sub.name);
                return (
                  <Card key={sub.name} className="group cursor-pointer transition-all hover:shadow-lg hover:border-accent/30">
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                        <PartIcon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground">{sub.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {sub.count > 0
                            ? `${sub.count} part${sub.count !== 1 ? 's' : ''} available`
                            : 'Available on request'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Fallback default categories when admin hasn't configured parts subcategories */}
              {[
                { icon: Cpu, title: 'CT & MRI Coils', description: 'Replacement coils for all major CT and MRI systems' },
                { icon: CircleDot, title: 'X-Ray Tubes', description: 'New and refurbished X-ray tubes for radiography systems' },
                { icon: Package, title: 'Ultrasound Probes', description: 'Transducers and probes for diagnostic ultrasound' },
                { icon: Wrench, title: 'Ophthalmology Parts', description: 'Lenses, mirrors, and optical components' },
                { icon: Cable, title: 'Cables & Connectors', description: 'Power cables, data cables, and signal connectors' },
                { icon: Zap, title: 'Power Supplies', description: 'Replacement power supply units for medical equipment' },
              ].map((cat) => (
                <Card key={cat.title} className="group cursor-pointer transition-all hover:shadow-lg hover:border-accent/30">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{cat.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-2 text-center">
              Looking for a Specific Part?
            </h2>
            <p className="text-base text-muted-foreground mb-8 text-center">
              Tell us what you need and our team will source it for you. We have access to parts from all major manufacturers.
            </p>
            <LeadForm type="quote" />
          </div>
        </div>
      </section>
    </>
  );
}
