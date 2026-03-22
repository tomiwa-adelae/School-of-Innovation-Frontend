import type { Metadata } from "next";
import ForgotPasswordClient from "./_components/ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your School of Innovation account password. Enter your email address and we will send you a verification code to get back into your account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
