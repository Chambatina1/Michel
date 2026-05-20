import { TrustBar } from "@/components/layout/TrustBar";
import { CTASection } from "@/components/layout/CTASection";
import { LeadForm } from "@/components/layout/LeadForm";
import { BlogSection } from "@/components/layout/BlogSection";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      {/* Trust Bar */}
      <TrustBar />

      {/* Hero Section with Banner Image */}
      <section className="relative overflow-hidden min-h-[520px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <HeartPulse className="h-3.5 w-3.5" />
            Trusted by 500+ Healthcare Facilities
          </span>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Medical Imaging & Ophthalmology
            <br />
            <span className="text-accent">Equipment You Can Trust</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            From CT scanners to ophthalmology devices, we supply, service, and
            buy medical equipment with unmatched expertise and fair pricing.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-[180px] bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg whitespace-nowrap"
            >
              <Link href="/catalog">
                Browse Equipment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[180px] border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white whitespace-nowrap"
            >
              <Link href="/sell-equipment">Sell Your Equipment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Equipment Categories - Two Main Categories */}
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
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Imaging Equipment */}
            <Card className="group overflow-hidden border-2 transition-all hover:shadow-xl hover:border-accent/30">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MonitorSmartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Imaging Equipment</h3>
                    <p className="text-sm text-muted-foreground">Medical imaging systems and modalities</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'CT Scanners', href: '/catalog?category=CT', icon: Activity, count: '12+ Models' },
                    { name: 'MRI', href: '/catalog?category=MRI', icon: Stethoscope, count: '8+ Models' },
                    { name: 'X-Ray', href: '/catalog?category=X-Ray', icon: HeartPulse, count: '15+ Models' },
                    { name: 'Ultrasound', href: '/catalog?category=Ultrasound', icon: MonitorSmartphone, count: '10+ Models' },
                  ].map((sub) => (
                    <Link key={sub.name} href={sub.href} className="flex items-center gap-2.5 rounded-lg border border-border/50 p-3 transition-all hover:bg-accent/5 hover:border-accent/20">
                      <sub.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">{sub.count}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-4 w-full whitespace-nowrap">
                  <Link href="/catalog?parentCategory=Imaging+Equipment">
                    View All Imaging Equipment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Ophthalmology Equipment */}
            <Card className="group overflow-hidden border-2 transition-all hover:shadow-xl hover:border-accent/30">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Ophthalmology Equipment</h3>
                    <p className="text-sm text-muted-foreground">Eye care and diagnostic devices</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'OCT', href: '/catalog?category=OCT', icon: Eye, count: '6+ Models' },
                    { name: 'Retinal Camera', href: '/catalog?category=Retinal+Camera', icon: Camera, count: '5+ Models' },
                    { name: 'Visual Field', href: '/catalog?category=Visual+Field', icon: Grid3X3, count: '4+ Models' },
                    { name: 'Refractometers', href: '/catalog?category=Refractometers', icon: Ruler, count: '7+ Models' },
                    { name: 'Examination', href: '/catalog?category=Examination', icon: Search, count: '10+ Models' },
                  ].map((sub) => (
                    <Link key={sub.name} href={sub.href} className="flex items-center gap-2.5 rounded-lg border border-border/50 p-3 transition-all hover:bg-accent/5 hover:border-accent/20">
                      <sub.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">{sub.count}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button asChild variant="outline" className="mt-4 w-full whitespace-nowrap">
                  <Link href="/catalog?parentCategory=Ophthalmology+Equipment">
                    View All Ophthalmology Equipment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Parts & Accessories CTA */}
          <div className="mt-8 text-center">
            <Link href="/parts-accessories" className="inline-flex">
              <Card className="inline-flex items-center gap-4 px-8 py-4 cursor-pointer transition-all hover:shadow-lg hover:border-accent/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Wrench className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Parts & Accessories</p>
                  <p className="text-sm text-muted-foreground">100+ replacement parts, coils, detectors, and accessories</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-secondary/30 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { value: "500+", label: "Healthcare Clients" },
            { value: "2,000+", label: "Devices Sold" },
            { value: "15+", label: "Years Experience" },
            { value: "98%", label: "Client Satisfaction" },
          ].map((stat) => (
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

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Why Healthcare Facilities Choose{" "}
                <span className="text-accent">P&S Medical Device Inc.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                With over 15 years in the medical equipment industry, we
                combine technical expertise with a commitment to patient care
                outcomes.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Quality Guaranteed",
                    desc: "Every device undergoes rigorous testing and certification before delivery.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Competitive Pricing",
                    desc: "Save 30-60% compared to new equipment without sacrificing performance.",
                  },
                  {
                    icon: Wrench,
                    title: "Full Service & Support",
                    desc: "Installation, training, maintenance, and 24/7 emergency repair services.",
                  },
                  {
                    icon: Search,
                    title: "Expert Consultation",
                    desc: "Our specialists help you choose the right equipment for your specific needs.",
                  },
                ].map((item) => (
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
        title="Ready to Upgrade Your Medical Equipment?"
        description="Whether you're buying, selling, or need service, our team is ready to help you find the perfect solution for your facility."
        buttonText="Get a Free Consultation"
        buttonLink="/contact?type=quote"
        variant="primary"
      />

      {/* Second CTA */}
      <CTASection
        title="Have Old Equipment to Sell?"
        description="We buy used, broken, or decommissioned medical devices at fair market prices. Get a same-day offer."
        buttonText="Get Your Offer Now"
        buttonLink="/sell-equipment"
        variant="accent"
      />
    </>
  );
}
