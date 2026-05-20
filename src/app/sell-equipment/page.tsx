'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DollarSign,
  Clock,
  Truck,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  Camera,
  Phone,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useSiteSettings, getSetting } from '@/lib/useSiteSettings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/* ── Schema ── */
const sellFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  company: z.string().optional(),
  equipmentType: z.string().min(1, 'Please select equipment type'),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  condition: z.string().min(1, 'Please select equipment condition'),
  description: z.string().optional(),
  askingPrice: z.string().optional(),
});

type SellFormValues = z.infer<typeof sellFormSchema>;

const EQUIPMENT_TYPES = ['CT', 'MRI', 'X-Ray', 'Ultrasound', 'Ophthalmology', 'Other'];
const CONDITIONS = ['Working', 'Needs Repair', 'Non-Working', 'Parts Only'];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── FAQ Data ── */
const faqItems = [
  {
    question: 'What types of equipment do you buy?',
    answer: 'We purchase all types of medical imaging equipment including CT scanners, MRI machines, X-ray systems, ultrasound units, and ophthalmology devices. We accept equipment in any condition — working, needs repair, non-working, or for parts.',
  },
  {
    question: 'How do you determine the offer price?',
    answer: 'Our offers are based on fair market value, considering factors such as the equipment\'s age, brand, model, condition, maintenance history, and current market demand. We provide transparent pricing with no hidden fees.',
  },
  {
    question: 'Do you handle equipment removal and logistics?',
    answer: 'Yes! We handle all logistics including deinstallation, packing, and transportation. Our certified technicians ensure safe removal from your facility at no cost to you. We coordinate scheduling to minimize disruption to your operations.',
  },
  {
    question: 'How long does the selling process take?',
    answer: 'Once we receive your submission, we typically respond with an initial offer within 24-48 hours. After agreement, scheduling and removal usually take 1-2 weeks depending on equipment type and location. Payment is processed promptly upon pickup.',
  },
  {
    question: 'What if my equipment is broken or non-functional?',
    answer: 'We buy equipment in all conditions. Even non-functional equipment has value through salvageable parts, components, and scrap materials. We\'ll evaluate your equipment and make a fair offer regardless of its working condition.',
  },
  {
    question: 'Do you provide documentation for the sale?',
    answer: 'Absolutely. We provide a bill of sale, certificate of deinstallation, and any necessary transfer documentation. All transactions are handled professionally and can be coordinated with your compliance and accounting departments.',
  },
];

/* ── Main Component ── */
export default function SellEquipmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings } = useSiteSettings();
  const phone = getSetting(settings, 'contact_phone', '+1 (305) 244-9340');
  const phoneHref = phone.replace(/[^+\d]/g, '');

  const form = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      equipmentType: '',
      manufacturer: '',
      model: '',
      condition: '',
      description: '',
      askingPrice: '',
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return; // 5MB limit
      if (photoFiles.length >= 5) return; // Max 5 photos

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result as string]);
        setPhotoFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: SellFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/sell-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          photos: [], // Send empty since we can't upload to server in this demo
          askingPrice: values.askingPrice ? parseFloat(values.askingPrice) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }

      setIsSuccess(true);
      form.reset();
      setPhotos([]);
      setPhotoFiles([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      form.setError('root', { message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <section className="gradient-primary py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Sell Your Equipment</h1>
          </div>
        </section>
        <section className="py-20">
          <motion.div
            className="mx-auto max-w-lg px-4 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Thank You!</h2>
            <p className="text-muted-foreground mb-2">
              Your equipment submission has been received successfully.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Our team will review your submission and get back to you with an offer within 24-48 hours.
              We&apos;ll contact you at the email address you provided.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccess(false);
                  setPhotos([]);
                  setPhotoFiles([]);
                }}
              >
                Submit Another
              </Button>
              <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

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
            We Buy Your Used or Broken
            <br />
            <span className="text-teal-300">Medical Equipment</span>
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get a fair offer for equipment you no longer need. We accept working, non-working, and parts-only equipment.
          </motion.p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                title: 'Fair Market Value',
                description: 'We offer competitive prices based on equipment condition, brand, and current market demand. No lowball offers — just fair, transparent pricing.',
              },
              {
                icon: Clock,
                title: 'Quick Process',
                description: 'Get an initial offer within 24-48 hours. Fast evaluation, quick scheduling, and prompt payment upon equipment pickup.',
              },
              {
                icon: Truck,
                title: 'We Handle Logistics',
                description: 'Our certified technicians handle deinstallation, packing, and transportation. Zero hassle for your facility.',
              },
            ].map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mx-auto mb-4">
                      <benefit.icon className="h-7 w-7 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="py-10 sm:py-14 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form */}
            <motion.div
              className="lg:col-span-2"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-foreground mb-1">Submit Your Equipment</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Fill out the form below with details about your equipment. Our team will review and respond within 24-48 hours.
                  </p>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      {form.formState.errors.root && (
                        <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                          {form.formState.errors.root.message}
                        </div>
                      )}

                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input placeholder="John Smith" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@hospital.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Phone & Company */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="(555) 000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company / Hospital</FormLabel>
                              <FormControl>
                                <Input placeholder="Acme Hospital" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Equipment Type & Condition */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="equipmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipment Type <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {EQUIPMENT_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="condition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Condition <span className="text-destructive">*</span></FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CONDITIONS.map((cond) => (
                                    <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Manufacturer & Model */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="manufacturer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manufacturer</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., GE, Siemens, Philips" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="model"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Model</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Revolution CT" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                rows={4}
                                placeholder="Include details like year of manufacture, maintenance history, accessories included, and any known issues..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Asking Price */}
                      <FormField
                        control={form.control}
                        name="askingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asking Price (optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 150000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Photo Upload */}
                      <div>
                        <FormLabel className="mb-2 block">Photos (optional, max 5)</FormLabel>
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-teal-600/50 hover:bg-teal-50/30 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload photos of your equipment
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 5MB each
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </div>

                        {/* Photo Previews */}
                        {photos.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-4">
                            {photos.map((photo, idx) => (
                              <div key={idx} className="relative group">
                                <div className="h-20 w-20 rounded-lg overflow-hidden border border-border">
                                  <img
                                    src={photo}
                                    alt={`Upload ${idx + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removePhoto(idx)}
                                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Equipment Details
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Sidebar */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <div className="lg:sticky lg:top-24">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <HelpCircle className="h-5 w-5 text-teal-600" />
                      <h3 className="font-semibold text-foreground">Frequently Asked Questions</h3>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {faqItems.map((item, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`}>
                          <AccordionTrigger className="text-sm">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>

                <Card className="mt-6 border-teal-200 bg-teal-50 dark:border-teal-800 dark:bg-teal-950/30">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Prefer to Talk?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Call us directly for a faster evaluation.
                    </p>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white w-full">
                      <a href={`tel:${phoneHref}`}>{phone}</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
