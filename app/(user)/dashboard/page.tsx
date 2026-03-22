import type { Metadata } from "next";
import DashboardClient from "./_components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your School of Innovation learning dashboard.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
