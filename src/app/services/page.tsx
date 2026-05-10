'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Wrench,
  Headphones,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Settings,
  BookOpen,
  Shield,
  Monitor,
  Stethoscope,
  HeartPulse,
  Star,
  Zap,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CTASection } from '@/components/layout/CTASection';

/* ── Icon mapper: convert string name → lucide component ── */
const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Headphones,
  MessageSquare,
  Shield,
  Monitor,
  Stethoscope,
  HeartPulse,
  Clock,
  MapPin,
  Users,
  Settings,
  BookOpen,
  Star,
  Zap,
  Truck,
  CheckCircle2,
  ArrowRight,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Wrench;
}

/* ── Animation variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── Types ── */
interface ServiceData {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  icon: string;
  coverImage: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isFeatured: boolean;
}

/* ═══════════════════════════════════════════════════════ */

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services?published=true');
        if (res.ok) {
          const data = await res.json();
          setServices(data.services || []);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Comprehensive Medical
            <br />
            <span className="text-teal-300">Equipment Services</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            From repair and maintenance to training and consultative advisory, we provide end-to-end support for all your medical imaging equipment needs.
          </motion.p>
        </div>
      </section>

      {/* Service Sections */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {loading ? (
            /* Loading skeleton */
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="lg:col-span-2 bg-muted min-h-[340px]" />
                    <div className="lg:col-span-3 p-6 sm:p-10 space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                      <div className="h-10 bg-muted rounded w-40" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : services.length === 0 ? (
            /* Empty state */
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mx-auto mb-4">
                <Settings className="h-8 w-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No Services Available</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We&apos;re currently updating our service offerings. Please check back soon or contact us directly for assistance.
              </p>
              <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            /* Service cards with alternating layout */
            services.map((service, index) => {
              const IconComponent = getIcon(service.icon);
              const isReversed = index % 2 !== 0; // Alternating layout

              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Image section */}
                        <div
                          className={`lg:col-span-2 relative overflow-hidden min-h-[280px] sm:min-h-[340px] ${
                            isReversed ? 'order-2 lg:order-1' : ''
                          }`}
                        >
                          {service.coverImage ? (
                            <Image
                              src={service.coverImage}
                              alt={service.title}
                              fill
                              className="object-cover"
                              priority={index < 2}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
                              <IconComponent className="h-20 w-20 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
                                <IconComponent className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                              {service.title}
                            </h2>
                          </div>
                        </div>

                        {/* Content section */}
                        <div className={`lg:col-span-3 p-6 sm:p-10 ${isReversed ? 'order-1 lg:order-2' : ''}`}>
                          <p className="text-muted-foreground leading-relaxed mb-6">
                            {service.shortDesc}
                          </p>

                          {/* Features list */}
                          {service.features && service.features.length > 0 && (
                            <ul className="space-y-2 mb-6">
                              {service.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* CTA Button */}
                          <Button
                            asChild
                            className={
                              isReversed
                                ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                                : 'bg-teal-600 hover:bg-teal-700 text-white'
                            }
                            variant={isReversed ? 'outline' : 'default'}
                          >
                            <Link href={service.ctaLink || '/contact'}>
                              {isReversed ? (
                                <>
                                  <IconComponent className="mr-2 h-4 w-4" />
                                  {service.ctaText || 'Learn More'}
                                </>
                              ) : (
                                <>
                                  {service.ctaText || 'Learn More'}
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* How Our Service Works */}
      <section className="py-14 sm:py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How Our Service Works</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A simple, streamlined process from initial contact to completed service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: 'Contact Us',
                description: 'Reach out via phone, email, or our online form to describe your needs.',
                icon: MessageSquare,
              },
              {
                step: 2,
                title: 'Assessment',
                description: 'Our specialists evaluate your requirements and develop a tailored plan.',
                icon: Users,
              },
              {
                step: 3,
                title: 'Service Delivery',
                description: 'Our certified team delivers the service on-site with minimal disruption.',
                icon: Wrench,
              },
              {
                step: 4,
                title: 'Ongoing Support',
                description: 'Post-service support and preventive maintenance to keep things running.',
                icon: Headphones,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-flex">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mx-auto">
                    <item.icon className="h-7 w-7 text-teal-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Coverage */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <MapPin className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-3">Service Area Coverage</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              We provide equipment services across the entire United States. Our nationwide network of certified technicians ensures rapid response times wherever your facility is located.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { region: 'Northeast', states: 'NY, NJ, PA, CT, MA' },
                { region: 'Southeast', states: 'FL, GA, NC, VA, TX' },
                { region: 'Midwest', states: 'IL, OH, MI, MN, WI' },
                { region: 'West Coast', states: 'CA, WA, OR, AZ, NV' },
              ].map((area) => (
                <Card key={area.region}>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-foreground text-sm">{area.region}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{area.states}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Need Equipment Service or Support?"
        description="Our expert team is standing by to help. Whether it's a repair, training, or equipment consultation, we're here for you."
        buttonText="Contact Us Now"
        buttonLink="/contact?type=support"
        variant="accent"
      />
    </>
  );
}
