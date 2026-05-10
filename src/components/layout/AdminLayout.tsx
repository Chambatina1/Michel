'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatWidget } from '@/components/chat/AIChatWidget';
import { WhatsAppButton } from '@/components/chat/WhatsAppButton';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatWidget />
      <WhatsAppButton />
    </>
  );
}
