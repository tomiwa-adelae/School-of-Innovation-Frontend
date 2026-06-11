import type { Metadata } from "next";
import { VerifyClient } from "./_components/VerifyClient";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description:
    "Verify the authenticity of a School of Innovation certificate of completion using its certificate number.",
  alternates: { canonical: "https://innovationconference.com.ng/verify" },
};

export default function VerifyPage() {
  return <VerifyClient />;
}
