"use client";

import { useState, useEffect } from "react";
import { TrustBar } from "@/components/layout/TrustBar";
import { CTASection } from "@/components/layout/CTASection";
import { LeadForm } from "@/components/layout/LeadForm";
import { BlogSection } from "@/components/layout/BlogSection";
import { FeaturedCarousel } from "@/components/layout/FeaturedCarousel";
import { useSiteSettings, getSetting } from "@/lib/useSiteSettings";
import {
  Search,
  ArrowRight,
  Stethoscope,
  MonitorSmartphone,
  Wrench,
  ShieldCheck,
  TrendingUp,
  HeartPulse,
  Activity,
  Eye,
  Camera,
  Grid3X3,
  Ruler,
  Cpu,
  Package,
  CircleDot,
  Cable,
  Zap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/* ── Icon mapping for dynamic categories ── */
const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'imaging': MonitorSmartphone,
  'ophthalmology': ShieldCheck,
  'parts': Wrench,
  'laboratory': Activity,
  'surgical': Stethoscope,
  'patient-monitoring': HeartPulse,
  'other': Package,
};

const SUBCATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  'ct': Activity,
  'mri': Activity,
  'x-ray': HeartPulse,
  'ultrasound': Stethoscope,
  'mammography': ShieldCheck,
  'c-arm': MonitorSmartphone,
  'dxa': Activity,
  'o-arm': MonitorSmartphone,
  'oct': ShieldCheck,
  'retinal camera': Camera,
  'visual field': Grid3X3,
  'refractometers': Ruler,
  'examination': Search,
};

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
};

function getIconForSubcategory(name: string): React.ElementType {
  const key = name.toLowerCase().trim();
  for (const [k, icon] of Object.entries(SUBCATEGORY_ICON_MAP)) {
    if (key.includes(k)) return icon;
  }
  for (const [k, icon] of Object.entries(PARTS_ICON_MAP)) {
    if (key.includes(k)) return icon;
  }
  return Wrench;
}

function getIconForCategory(name: string): React.ElementType {
  const key = name.toLowerCase().trim();
  for (const [k, icon] of Object.entries(CATEGORY_ICON_MAP)) {
    if (key.includes(k)) return icon;
  }
  return Package;
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

export default function HomePage() {
  const { settings } = useSiteSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Hero
  const heroBadge = getSetting(settings, 'hero_badge');
  const heroHeadline = getSetting(settings, 'hero_headline', 'Medical Imaging & Ophthalmology|Equipment You Can Trust');
  const heroSubtitle = getSetting(settings, 'hero_subtitle', 'New, used and refurbished diagnostic imaging and ophthalmology equipment. We buy, sell, refurbish and service medical devices.');
  const heroBtnPrimary = getSetting(settings, 'hero_btn_primary', 'Browse Equipment');
  const heroBtnSecondary = getSetting(settings, 'hero_btn_secondary', 'Sell Your Equipment');

  const headlineParts = heroHeadline.split('|');
  const headlineMain = headlineParts[0] || heroHeadline;
  const headlineAccent = getSetting(settings, 'hero_accent', headlineParts[1] || '');

  // Stats
  const stats = [
    { value: getSetting(settings, 'stat1_value'), label: getSetting(settings, 'stat1_label') },
    { value: getSetting(settings, 'stat2_value'), label: getSetting(settings, 'stat2_label') },
    { value: getSetting(settings, 'stat3_value'), label: getSetting(settings, 'stat3_label') },
    { value: getSetting(settings, 'stat4_value'), label: getSetting(settings, 'stat4_label') },
  ].filter((stat) => stat.value && stat.label); // empty in the admin = hidden

  // Why Choose Us
  const whyTitle = getSetting(settings, 'why_title', 'Why Healthcare Facilities Choose P&S Medical Device Inc.');
  const whySubtitle = getSetting(settings, 'why_subtitle', 'We focus on diagnostic imaging and ophthalmology equipment, and we help each facility find the right unit for its needs and budget.');
  const whyFeatures = [
    { icon: ShieldCheck, title: getSetting(settings, 'why_f1_title', 'Imaging & Ophthalmology Focus'), desc: getSetting(settings, 'why_f1_desc', 'We specialize in diagnostic imaging and ophthalmology equipment.') },
    { icon: TrendingUp, title: getSetting(settings, 'why_f2_title', 'New, Used & Refurbished'), desc: getSetting(settings, 'why_f2_desc', 'Options for different budgets, with condition and included items stated in every quote.') },
    { icon: Wrench, title: getSetting(settings, 'why_f3_title', 'Service'), desc: getSetting(settings, 'why_f3_desc', 'Services related to the equipment we sell. Contact us to confirm scope and availability.') },
    { icon: Search, title: getSetting(settings, 'why_f4_title', 'We Buy Equipment'), desc: getSetting(settings, 'why_f4_desc', 'Sell us your used or decommissioned devices.') },
  ];

  // CTA 1
  const cta1Title = getSetting(settings, 'cta1_title', 'Ready to Upgrade Your Medical Equipment?');
  const cta1Desc = getSetting(settings, 'cta1_desc', "Whether you're buying, selling, or need service, our team is ready to help you find the perfect solution for your facility.");
  const cta1Btn = getSetting(settings, 'cta1_btn', 'Get a Free Consultation');

  // CTA 2
  const cta2Title = getSetting(settings, 'cta2_title', 'Have Old Equipment to Sell?');
  const cta2Desc = getSetting(settings, 'cta2_desc', 'We buy used, broken, or decommissioned medical devices. Tell us about your equipment and we will get back to you with an offer.');
  const cta2Btn = getSetting(settings, 'cta2_btn', 'Get Your Offer Now');

  // Separate equipment categories from "Parts & Accessories"
  const equipmentCategories = categories.filter(c => {
    const n = c.name.toLowerCase();
    return !n.includes('part') && !n.includes('accessory');
  });
  const partsCategory = categories.find(c => {
    const n = c.name.toLowerCase();
    return n.includes('part') || n.includes('accessory');
  });

  return (
    <>
      {/* Trust Bar */}
      <TrustBar />

      {/* Hero Section with Background Video */}
      <section className="relative overflow-hidden min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/videos/hero-poster.jpg')" }}
        />
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-primary/40" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          {heroBadge && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <HeartPulse className="h-3.5 w-3.5" />
              {heroBadge}
            </span>
          )}
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {headlineMain}
            {headlineAccent && (
              <>
                <br />
                <span className="text-accent">{headlineAccent}</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-[180px] bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg whitespace-nowrap"
            >
              <Link href="/catalog">
                {heroBtnPrimary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[180px] border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white whitespace-nowrap"
            >
              <Link href="/sell-equipment">{heroBtnSecondary}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured equipment carousel (Admin > Carrusel) */}
      <FeaturedCarousel settings={settings} />

      {/* Equipment Categories — Dynamic from API */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Our Equipment Categories
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Browse our comprehensive inventory organized by specialty
            </p>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : equipmentCategories.length === 0 ? (
            <div className="mt-12 text-center text-muted-foreground">
              <p className="text-lg">No categories configured yet. An admin can create categories in the admin panel.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/catalog">Browse All Equipment</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {equipmentCategories.map((cat) => {
                const CatIcon = getIconForCategory(cat.name);
                // Show up to 5 subcategories on the card
                const displaySubs = (cat.subcategoriesList || []).slice(0, 5);
                const remainingCount = Math.max(0, (cat.subcategoriesList || []).length - 5);

                return (
                  <Card key={cat.id} className="group overflow-hidden border-2 transition-all hover:shadow-xl hover:border-accent/30">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <CatIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{cat.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {(cat.subcategoriesList || []).length} subcategories available
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-3">
                        {displaySubs.map((sub) => {
                          const SubIcon = getIconForSubcategory(sub.name);
                          const encodedCat = encodeURIComponent(cat.name);
                          const encodedSub = encodeURIComponent(sub.name);
                          return (
                            <Link
                              key={sub.name}
                              href={`/catalog?parentCategory=${encodedCat}&category=${encodedSub}`}
                              className="flex items-center gap-2.5 rounded-lg border border-border/50 p-3 transition-all hover:bg-accent/5 hover:border-accent/20"
                            >
                              <SubIcon className="h-4 w-4 text-muted-foreground group-hover:text-accent shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{sub.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {sub.count > 0 ? `${sub.count}+ Models` : 'Coming Soon'}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      {remainingCount > 0 && (
                        <Button asChild variant="outline" className="mt-3 w-full">
                          <Link href={`/catalog?parentCategory=${encodeURIComponent(cat.name)}`}>
                            +{remainingCount} more subcategories
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="outline" className="mt-4 w-full whitespace-nowrap">
                        <Link href={`/catalog?parentCategory=${encodeURIComponent(cat.name)}`}>
                          View All {cat.name}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Parts & Accessories — Dynamic from categories or fallback link */}
          <div className="mt-8 text-center">
            {partsCategory && (partsCategory.subcategoriesList || []).length > 0 ? (
              <Link href="/parts-accessories" className="inline-flex">
                <Card className="inline-flex items-center gap-4 px-8 py-4 cursor-pointer transition-all hover:shadow-lg hover:border-accent/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{partsCategory.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(partsCategory.subcategoriesList || []).length} categories, {(partsCategory.subcategoriesList || []).reduce((sum, s) => sum + s.count, 0)}+ parts
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                </Card>
              </Link>
            ) : (
              <Link href="/parts-accessories" className="inline-flex">
                <Card className="inline-flex items-center gap-4 px-8 py-4 cursor-pointer transition-all hover:shadow-lg hover:border-accent/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Parts & Accessories</p>
                    <p className="text-sm text-muted-foreground">Replacement parts, coils, detectors, and accessories</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                </Card>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats.length > 0 && (
      <section className="border-y border-border bg-secondary/30 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {whyTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {whySubtitle}
              </p>
              <ul className="mt-8 space-y-4">
                {whyFeatures.filter((item) => item.title).map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <LeadForm type="quote" className="w-full max-w-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <CTASection
        title={cta1Title}
        description={cta1Desc}
        buttonText={cta1Btn}
        buttonLink="/contact?type=quote"
        variant="primary"
      />

      {/* Second CTA */}
      <CTASection
        title={cta2Title}
        description={cta2Desc}
        buttonText={cta2Btn}
        buttonLink="/sell-equipment"
        variant="accent"
      />
    </>
  );
}
