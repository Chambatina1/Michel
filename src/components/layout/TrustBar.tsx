import { ShieldCheck, Wrench, RefreshCw, Award } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    label: "Expert Advisory",
    description: "Personalized equipment guidance",
  },
  {
    icon: Wrench,
    label: "After-Sales Support",
    description: "Maintenance & repair services",
  },
  {
    icon: RefreshCw,
    label: "We Buy Broken Equipment",
    description: "Fair prices for any condition",
  },
  {
    icon: Award,
    label: "Certified Refurbished",
    description: "Quality-assured pre-owned",
  },
];

export function TrustBar() {
  return (
    <section className="border-b border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop: horizontal row */}
        <div className="hidden md:flex items-center justify-center divide-x divide-border">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-8 py-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden items-center gap-4 overflow-x-auto py-4 scrollbar-none">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex shrink-0 items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/5 text-primary">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground whitespace-nowrap">
                  {item.label}
                </p>
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
