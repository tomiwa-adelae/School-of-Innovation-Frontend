import type { Metadata } from "next";
import CertificatesClient from "./_components/CertificatesClient";

export const metadata: Metadata = {
  title: "My Certificates",
  description: "View and download all certificates you have earned on School of Innovation.",
  robots: { index: false, follow: false },
};

export default function CertificatesPage() {
  return <CertificatesClient />;
}
