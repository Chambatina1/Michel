'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  Truck,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ReturnsPage() {
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
            Return Policy
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            We stand behind every piece of equipment we sell. Our return policy is designed to be fair, transparent, and focused on your satisfaction.
          </motion.p>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">

            {/* Overview */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.4 }}
            >
              <p className="text-muted-foreground leading-relaxed text-base">
                At P&S Medical Device Inc., we are committed to providing high-quality medical imaging and ophthalmology equipment that meets the rigorous demands of healthcare facilities. We understand that purchasing medical equipment is a significant investment, and we want you to buy with confidence. This Return Policy outlines the terms and conditions under which equipment may be returned, exchanged, or refunded.
              </p>
            </motion.div>

            {/* Return Window */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-teal-600" />
                    Return Window
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    All equipment purchases are eligible for return within <strong className="text-foreground">30 calendar days</strong> from the date of delivery. The return window begins on the date the equipment is delivered to your facility as confirmed by the carrier&apos;s tracking information or signed delivery receipt.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    For custom orders or equipment specially configured to your specifications, the return window is <strong className="text-foreground">14 calendar days</strong> from delivery. Custom orders include equipment with specific software configurations, specialized probes or transducers, or items manufactured to order.
                  </p>
                  <div className="rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 p-3 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-teal-700 dark:text-teal-400">
                      Returns initiated after the applicable return window will not be accepted. We encourage you to inspect all equipment promptly upon delivery.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Eligible Items */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    Eligible Items for Return
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The following items are eligible for return within the return window, provided they meet the condition requirements listed below:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'New equipment that has not been installed, calibrated, or used in a clinical setting',
                      'Refurbished equipment that has not been modified, installed, or subjected to clinical use',
                      'Accessories and parts that are in their original, unopened packaging',
                      'Software licenses that have not been activated or registered',
                      'Items received with manufacturing defects or damage not caused by the customer',
                      'Items that do not match the product description or specifications listed at the time of purchase',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Refund Process */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-teal-600" />
                    Refund Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To initiate a return, please follow these steps:
                  </p>
                  <ol className="space-y-3">
                    {[
                      { step: '1', title: 'Contact Our Team', desc: 'Email returns@psmedicaldevices.com or call +1 (305) 244-9340 with your order number and reason for return. Our team will respond within 1 business day.' },
                      { step: '2', title: 'Receive RMA Number', desc: 'Once your return is approved, you will receive a Return Merchandise Authorization (RMA) number and detailed shipping instructions. Items returned without an RMA number will not be accepted.' },
                      { step: '3', title: 'Ship the Equipment', desc: 'Pack the equipment in its original packaging or equivalent protective packaging. Use the provided shipping label or ship to the address specified in your RMA instructions.' },
                      { step: '4', title: 'Inspection & Refund', desc: 'Upon receipt, our technical team will inspect the equipment within 5-10 business days. Once approved, your refund will be processed within 7-10 business days to your original payment method.' },
                    ].map((item) => (
                      <li key={item.step} className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold">
                          {item.step}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> Refunds are issued to the original payment method. For payments made by check or wire transfer, refunds will be issued by company check within 14 business days.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shipping Costs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5 text-teal-600" />
                    Return Shipping Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-3">
                    {[
                      { condition: 'Defective or Incorrect Items', cost: 'FREE', note: 'P&S Medical Device Inc. will cover all return shipping costs and arrange freight pickup at no charge to you.' },
                      { condition: 'Buyer\'s Remorse (Non-Defective)', cost: 'Customer', note: 'The customer is responsible for return shipping costs, including freight charges for large equipment. Original shipping charges are non-refundable.' },
                      { condition: 'Freight Equipment (CT, MRI, X-Ray)', cost: 'Varies', note: 'Freight shipping costs for returned large equipment will be quoted in advance. A restocking fee of 15% may apply to cover inspection and repackaging costs.' },
                    ].map((item, idx) => (
                      <li key={idx} className="rounded-lg border border-border p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.condition}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                          </div>
                          <Badge className={`text-xs shrink-0 ${item.cost === 'FREE' ? 'bg-emerald-100 text-emerald-700' : item.cost === 'Customer' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {item.cost}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Non-Returnable Items */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-red-200 dark:border-red-900/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <X className="h-5 w-5 text-red-500" />
                    Non-Returnable Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The following items cannot be returned or refunded:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Equipment that has been installed, calibrated, or used in a clinical or patient care setting',
                      'Consumable items such as gels, films, print media, and single-use accessories',
                      'Software that has been activated, registered, or had its license key revealed',
                      'Items returned without the original packaging, accessories, or documentation',
                      'Equipment that has been modified, altered, or repaired by unauthorized personnel',
                      'Items damaged due to improper handling, storage, or usage after delivery',
                      'Final sale or clearance items marked as non-returnable at the time of purchase',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Warranty Claims */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-teal-600" />
                    Warranty Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    All new and refurbished equipment sold by P&S Medical Device Inc. includes a warranty period as specified in the product listing or invoice. Warranty claims are handled separately from returns and follow a different process:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'New equipment typically includes a 90-day to 1-year warranty covering manufacturing defects',
                      'Refurbished equipment includes a 60-day to 90-day warranty depending on the product',
                      'Extended warranty options are available for purchase at the time of sale',
                      'Warranty service may include repair, replacement parts, or full unit replacement at our discretion',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To file a warranty claim, please contact our service department at <strong className="text-foreground">+1 (305) 244-9340</strong> or email <strong className="text-foreground">service@psmedicaldevices.com</strong>. Have your order number and a description of the issue ready.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="h-5 w-5 text-teal-600" />
                    Need Help With a Return?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our dedicated returns and support team is here to assist you. Whether you have questions about eligibility, need an RMA number, or want to check the status of your refund, we&apos;re just a call or email away.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground">+1 (305) 244-9340</p>
                        <p className="text-xs text-muted-foreground">Mon-Fri 8am-6pm EST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">returns@psmedicaldevices.com</p>
                        <p className="text-xs text-muted-foreground">Response within 1 business day</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                      <Link href="/contact?type=return">Start a Return</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/catalog">Browse Equipment</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Policy Last Updated */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-xs text-muted-foreground">
                This policy was last updated on January 1, 2025. P&S Medical Device Inc. reserves the right to update this policy at any time. Changes will be effective immediately upon posting to our website.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
