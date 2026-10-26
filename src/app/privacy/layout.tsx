import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description: "How P&S Medical Device Inc. collects and uses personal information on psmedicaldevices.com.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
