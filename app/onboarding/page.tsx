import type { Metadata } from "next";
import OnboardingClient from "./_components/OnboardingClient";

export const metadata: Metadata = {
  title: "Complete Your Profile",
  description: "Set up your School of Innovation profile to get started with your learning journey.",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
