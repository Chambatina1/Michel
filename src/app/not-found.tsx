import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

// Shown with a 404 status for any URL that doesn't exist, including removed products and posts
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for doesn&apos;t exist or the equipment is no longer available.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/catalog" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Browse equipment
        </Link>
        <Link href="/contact" className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
          Contact us
        </Link>
      </div>
    </div>
  );
}
