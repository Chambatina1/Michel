import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | P&S Medical Device Inc.",
  description: "How P&S Medical Device Inc. collects and uses personal information on psmedicaldevices.com.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
