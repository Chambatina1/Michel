'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Building2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LeadForm } from '@/components/layout/LeadForm';
import { CTASection } from '@/components/layout/CTASection';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactPage() {
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
            Get In Touch
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Have a question about our equipment, need service, or want to sell your used devices? We&apos;re here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Form - Takes up more space */}
            <motion.div
              className="lg:col-span-3"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <LeadForm type="contact" />
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="lg:col-span-2 space-y-5"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">Contact Information</h2>
                <p className="text-sm text-muted-foreground">
                  Reach us through any of these channels. We typically respond within 24 hours.
                </p>
              </div>

              <Card>
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/30">
                    <Phone className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <Button asChild variant="link" className="h-auto p-0 text-teal-600 hover:text-teal-700">
                      <a href="tel:+18005550199">(800) 555-0199</a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-0.5">Mon-Fri 8am-6pm EST</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/30">
                    <Mail className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <Button asChild variant="link" className="h-auto p-0 text-teal-600 hover:text-teal-700">
                      <a href="mailto:info@psmedicaldevices.com">info@psmedicaldevices.com</a>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-0.5">We reply within 24 hours</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/30">
                    <MapPin className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground">
                      123 Medical Center Dr,
                      <br />
                      Suite 400, New York, NY 10001
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/30">
                    <Clock className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Business Hours</p>
                    <div className="text-sm text-muted-foreground space-y-0.5 mt-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 1:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" className="h-auto py-3">
                  <a href="tel:+18005550199">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Us
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto py-3">
                  <a href="mailto:info@psmedicaldevices.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-10 sm:py-14 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="h-72 sm:h-80 lg:h-96 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="font-semibold text-slate-400 dark:text-slate-500">Map</p>
                <p className="text-sm text-slate-400 dark:text-slate-600 mt-1 max-w-sm">
                  123 Medical Center Dr, Suite 400, New York, NY 10001
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to Get Started?"
        description="Whether you need to buy equipment, sell your used devices, or schedule a service, our team is ready to help."
        buttonText="Browse Equipment"
        buttonLink="/catalog"
        variant="primary"
      />
    </>
  );
}
