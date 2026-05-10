'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Wrench,
  Headphones,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Shield,
  Monitor,
  Stethoscope,
  HeartPulse,
  Clock,
  MapPin,
  Users,
  Settings,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CTASection } from '@/components/layout/CTASection';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ServicesPage() {
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
          {/* Service 1: Repair & Maintenance */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-2 relative overflow-hidden min-h-[280px] sm:min-h-[340px]">
                    <Image
                      src="/images/services/repair-maintenance.jpg"
                      alt="Medical equipment repair and maintenance by certified biomedical engineers"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
                          <Wrench className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Equipment Repair & Maintenance</h2>
                    </div>
                  </div>
                  <div className="lg:col-span-3 p-6 sm:p-10">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Our team of certified biomedical engineers provides expert repair and preventive maintenance services for all types of medical imaging equipment. We minimize downtime and keep your systems running at peak performance.
                    </p>
                    <div className="mb-6">
                      <h3 className="font-semibold text-foreground mb-3">Supported Equipment Types</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { icon: Monitor, label: 'CT Scanners' },
                          { icon: HeartPulse, label: 'MRI Systems' },
                          { icon: Shield, label: 'X-Ray Systems' },
                          { icon: Stethoscope, label: 'Ultrasound' },
                          { icon: Settings, label: 'Ophthalmology' },
                          { icon: Wrench, label: 'Parts & Accessories' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4 text-teal-600" />
                            <span className="text-sm text-foreground">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {[
                        'Emergency repair with 4-hour response time',
                        'Preventive maintenance programs',
                        'Full system calibration and testing',
                        'OEM-quality replacement parts',
                        'Service contracts available',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                      <Link href="/contact?type=support">
                        Request Service
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service 2: Technical Support & Training */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-2 relative overflow-hidden min-h-[280px] sm:min-h-[340px] order-2 lg:order-1">
                    <Image
                      src="/images/services/technical-support.jpg"
                      alt="Medical equipment technical support and staff training programs"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
                          <Headphones className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Technical Support & Training</h2>
                    </div>
                  </div>
                  <div className="lg:col-span-3 p-6 sm:p-10 order-1 lg:order-2">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Our dedicated support team is available around the clock to assist with technical issues, software updates, and system optimization. We also offer comprehensive training programs to ensure your staff can operate equipment confidently and efficiently.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-teal-600" />
                          24/7 Support
                        </h3>
                        <ul className="space-y-2">
                          {[
                            'Phone and remote support',
                            'Real-time diagnostics',
                            'Software troubleshooting',
                            'Emergency escalations',
                          ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-teal-600" />
                          Training Programs
                        </h3>
                        <ul className="space-y-2">
                          {[
                            'On-site operator training',
                            'Advanced clinical applications',
                            'Safety and compliance',
                            'Certification programs',
                          ].map((item) => (
                            <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <Link href="/contact?type=support">
                        <Headphones className="mr-2 h-4 w-4" />
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service 3: Consultative Sales Advisory */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className="lg:col-span-2 relative overflow-hidden min-h-[280px] sm:min-h-[340px]">
                    <Image
                      src="/images/services/sales-advisory.jpg"
                      alt="Professional medical equipment sales consultation and advisory services"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Consultative Sales Advisory</h2>
                    </div>
                  </div>
                  <div className="lg:col-span-3 p-6 sm:p-10">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Choosing the right medical equipment is a significant investment. Our expert advisors work alongside your team to understand your clinical needs, budget constraints, and growth plans to recommend the best solution for your facility.
                    </p>
                    <h3 className="font-semibold text-foreground mb-3">How We Help</h3>
                    <div className="space-y-3 mb-6">
                      {[
                        { title: 'Needs Assessment', desc: 'Comprehensive evaluation of your imaging requirements, patient volume, and clinical applications.' },
                        { title: 'Budget Planning', desc: 'Transparent pricing with options for new, refurbished, or refurbished-to-new upgrade paths.' },
                        { title: 'Facility Planning', desc: 'Site evaluation, room requirements, electrical specifications, and installation coordination.' },
                        { title: 'Comparison Analysis', desc: 'Side-by-side comparison of equipment from different manufacturers to find the best fit.' },
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                      <Link href="/contact?type=quote">
                        Schedule Consultation
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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

      {/* Service Area */}
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
