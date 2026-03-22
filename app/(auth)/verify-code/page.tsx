import type { Metadata } from "next";
import VerifyCodeClient from "./_components/VerifyCodeClient";

export const metadata: Metadata = {
  title: "Verify Code",
  description:
    "Enter the 6-digit verification code sent to your email to reset your School of Innovation account password.",
  robots: { index: false, follow: false },
};

export default function VerifyCodePage() {
  return <VerifyCodeClient />;
}
