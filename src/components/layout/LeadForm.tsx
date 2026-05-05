"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const typeConfig = {
  quote: {
    title: "Request a Quote",
    description: "Get pricing on any medical equipment in our inventory.",
    submitLabel: "Submit Quote Request",
    messagePlaceholder:
      "I'm interested in... Please include equipment model, condition preferences, and any other requirements.",
  },
  contact: {
    title: "Contact Us",
    description: "Have a question? We'd love to hear from you.",
    submitLabel: "Send Message",
    messagePlaceholder:
      "How can we help you? Share any details about your inquiry.",
  },
  support: {
    title: "Support Request",
    description: "Need help with your equipment or a recent purchase?",
    submitLabel: "Submit Support Ticket",
    messagePlaceholder:
      "Describe the issue you're experiencing. Include any relevant details such as order number or equipment model.",
  },
};

function buildSchema(type: "quote" | "contact" | "support") {
  return z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(2000, "Message must be under 2,000 characters"),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

interface LeadFormProps {
  type: "quote" | "contact" | "support";
  productId?: string;
  className?: string;
}

export function LeadForm({ type, productId, className }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const config = typeConfig[type];
  const schema = buildSchema(type);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: productId
        ? `I'm interested in the product (ID: ${productId}). Please provide pricing and availability.`
        : "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          type,
          productId: productId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      form.setError("root", { message });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center",
          className
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-7 w-7 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Thank You!
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your {type} request has been submitted successfully. Our team will
          get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
          className="mt-2"
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border bg-card p-6 sm:p-8", className)}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">{config.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {config.description}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {form.formState.errors.root && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-destructive">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@hospital.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(555) 000-0000"
                      {...field}
                    />
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

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Message <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder={config.messagePlaceholder}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {config.submitLabel}
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
