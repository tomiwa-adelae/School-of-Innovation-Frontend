import type { Metadata } from "next";
import { VerifyClient } from "../_components/VerifyClient";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description:
    "Verify the authenticity of a School of Innovation certificate of completion.",
};

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateNumber: string }>;
}) {
  const { certificateNumber } = await params;
  return <VerifyClient initialCertNumber={certificateNumber} />;
}
