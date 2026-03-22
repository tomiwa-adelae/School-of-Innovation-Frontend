import type { Metadata } from "next";
import LoginClient from "./_components/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to your School of Innovation account to access your courses, track your progress, and continue learning.",
  openGraph: {
    title: "Login | School of Innovation",
    description:
      "Access your School of Innovation account and continue learning.",
    url: "https://innovationconference.com.ng/login",
  },
  alternates: { canonical: "https://innovationconference.com.ng/login" },
};

export default function LoginPage() {
  return <LoginClient />;
}
