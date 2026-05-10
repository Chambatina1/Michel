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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      {/* Trust Bar */}
      <TrustBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary hero-overlay">
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <HeartPulse className="h-3.5 w-3.5" />
            Trusted by 500+ Healthcare Facilities
          </span>
          <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Premium Medical Imaging
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
              className="min-w-[180px] bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
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
              className="min-w-[180px] border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/sell-equipment">Sell Your Equipment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Our Equipment Categories
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Browse our comprehensive inventory of certified medical devices
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MonitorSmartphone,
                title: "CT Scanners",
                count: "12+ Models",
                description:
                  "Multi-slice and single-slice CT scanners from leading manufacturers.",
              },
              {
                icon: Stethoscope,
                title: "MRI Machines",
                count: "8+ Models",
                description:
                  "Open and closed MRI systems with various field strengths.",
              },
              {
                icon: HeartPulse,
                title: "X-Ray Systems",
                count: "15+ Models",
                description:
                  "Digital radiography, fluoroscopy, and portable X-ray units.",
              },
              {
                icon: MonitorSmartphone,
                title: "Ultrasound",
                count: "10+ Models",
                description:
                  "Diagnostic, vascular, and point-of-care ultrasound systems.",
              },
              {
                icon: ShieldCheck,
                title: "Ophthalmology",
                count: "6+ Models",
                description:
                  "OCT, fundus cameras, slit lamps, and diagnostic equipment.",
              },
              {
                icon: Wrench,
                title: "Parts & Accessories",
                count: "100+ Items",
                description:
                  "Replacement parts, coils, detectors, and accessories.",
              },
            ].map((cat) => (
              <Card
                key={cat.title}
                className="group cursor-pointer transition-all hover:shadow-lg hover:border-accent/30"
              >
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {cat.title}
                    </h3>
                    <span className="text-xs font-medium text-accent">
                      {cat.count}
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/catalog">
                View All Equipment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
