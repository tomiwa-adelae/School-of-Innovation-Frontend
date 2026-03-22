import type { Metadata } from "next";
import ProgressClient from "./_components/ProgressClient";

export const metadata: Metadata = {
  title: "My Progress",
  description: "Track your learning progress and completion stats across all your enrolled courses.",
  robots: { index: false, follow: false },
};

export default function ProgressPage() {
  return <ProgressClient />;
}
