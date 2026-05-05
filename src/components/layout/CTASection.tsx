import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  variant?: "primary" | "accent";
}

export function CTASection({
  title,
  description,
  buttonText,
  buttonLink,
  variant = "primary",
}: CTASectionProps) {
  const isPrimary = variant === "primary";

  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 sm:py-20 lg:py-24",
        isPrimary ? "gradient-primary" : "gradient-accent"
      )}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className={cn(
              "min-w-[200px] text-base shadow-lg transition-all hover:shadow-xl",
              isPrimary
                ? "bg-white text-primary hover:bg-white/90"
                : "bg-white text-primary hover:bg-white/90"
            )}
          >
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[200px] border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
