import type { Metadata } from "next";
import LearnClient from "./_components/LearnClient";

export const metadata: Metadata = {
  title: "Course Player",
  description: "Continue learning your enrolled course on School of Innovation.",
  robots: { index: false, follow: false },
};

export default function LearnPage() {
  return <LearnClient />;
}
