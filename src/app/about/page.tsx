'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  Users,
  Award,
  Globe,
  ShieldCheck,
  Heart,
  Target,
  Lightbulb,
  Handshake,
  Building2,
  GraduationCap,
  Stethoscope,
  Wrench,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CTASection } from '@/components/layout/CTASection';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
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
            Your Trusted Medical Equipment Partner
            <br />
            <span className="text-teal-300">Since 2009</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            For nearly two decades, P&S Medical Device Inc. has been helping healthcare facilities access the medical imaging equipment they need to deliver exceptional patient care.
          </motion.p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Heart className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To make high-quality medical imaging equipment accessible and affordable for healthcare providers of all sizes. We believe every patient deserves the best diagnostic care, and we&apos;re committed to helping facilities achieve that goal through fair pricing, expert guidance, and exceptional service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Healthcare Providers Choose Us - Stats */}
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
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Why Healthcare Providers Choose Us
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Our track record speaks for itself. Here&apos;s what sets us apart.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              {
                icon: Calendar,
                value: '15+',
                label: 'Years Experience',
                description: 'Serving healthcare since 2009',
              },
              {
                icon: TrendingUp,
                value: '5,000+',
                label: 'Equipments Sold',
                description: 'Units delivered nationwide',
              },
              {
                icon: Star,
                value: '98%',
                label: 'Customer Satisfaction',
                description: 'Based on client surveys',
              },
              {
                icon: GraduationCap,
                value: '50+',
                label: 'Certified Technicians',
                description: 'Factory-trained specialists',
              },
              {
                icon: Globe,
                value: '48',
                label: 'States Served',
                description: 'Coast-to-coast coverage',
              },
              {
                icon: ShieldCheck,
                value: 'ISO',
                label: 'Certified',
                description: 'Quality management standards',
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6 pb-5 px-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mx-auto mb-3">
                      <stat.icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Expertise */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4">
                Our Team of <span className="text-teal-600">Experts</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our team brings together decades of combined experience in medical imaging, biomedical engineering, and healthcare operations. Every member of our team shares a commitment to helping healthcare facilities succeed.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Stethoscope,
                    title: 'Clinical Specialists',
                    desc: 'Former radiologists and imaging technologists who understand your clinical needs.',
                  },
                  {
                    icon: Wrench,
                    title: 'Biomedical Engineers',
                    desc: 'Factory-certified technicians trained on all major imaging equipment brands.',
                  },
                  {
                    icon: Building2,
                    title: 'Facility Planning Experts',
                    desc: 'Specialists who help plan equipment installations to optimize workflow and space.',
                  },
                  {
                    icon: TrendingUp,
                    title: 'Financial Advisors',
                    desc: 'Team members who help you find the best equipment within your budget constraints.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/30">
                      <item.icon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Team Visual Placeholder */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="h-80 w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                  <Users className="h-20 w-20 text-slate-300 dark:text-slate-600" />
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-xl bg-teal-600 text-white p-4 shadow-lg">
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-sm text-teal-100">Team Members</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications & Partners */}
      <section className="py-14 sm:py-20 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-3">
              Certifications & Partners
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We maintain the highest industry standards and partner with leading manufacturers.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {[
              'GE Healthcare',
              'Siemens Healthineers',
              'Philips Healthcare',
              'Canon Medical',
              'Hitachi Medical',
              'Toshiba Medical',
            ].map((partner) => (
              <Card key={partner} className="flex items-center justify-center py-6">
                <CardContent className="p-4 text-center">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 mx-auto mb-2 flex items-center justify-center">
                    <Award className="h-5 w-5 text-slate-400" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">{partner}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-3">Our Core Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              These principles guide everything we do at P&S Medical Device Inc.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Integrity',
                desc: 'Transparent pricing, honest assessments, and ethical business practices in every interaction.',
              },
              {
                icon: Heart,
                title: 'Patient-Centered',
                desc: 'Every decision we make is driven by how it impacts patient outcomes and healthcare quality.',
              },
              {
                icon: Lightbulb,
                title: 'Innovation',
                desc: 'Continuously improving our processes and adopting the latest technologies to better serve our clients.',
              },
              {
                icon: Handshake,
                title: 'Partnership',
                desc: 'Building long-term relationships based on trust, reliability, and mutual success with our clients.',
              },
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6 pb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mb-4">
                      <value.icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Work With Us?"
        description="Join the hundreds of healthcare facilities that trust P&S Medical Device Inc. for their equipment needs."
        buttonText="Get in Touch"
        buttonLink="/contact"
        variant="primary"
      />
    </>
  );
}
