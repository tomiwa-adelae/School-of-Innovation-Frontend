import type { Metadata } from "next";
import RegisterClient from "./_components/RegisterClient";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join School of Innovation and unlock access to hundreds of online courses in tech, design, business, and more. Sign up free today and start your learning journey.",
  keywords: [
    "sign up School of Innovation",
    "create account",
    "join online learning",
    "register Nigeria edtech",
  ],
  openGraph: {
    title: "Create Account | School of Innovation",
    description:
      "Sign up free and unlock hundreds of courses in tech, design, and business. Start learning today.",
    url: "https://innovationconference.com.ng/register",
  },
  alternates: { canonical: "https://innovationconference.com.ng/register" },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
