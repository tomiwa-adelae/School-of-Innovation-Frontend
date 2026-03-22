import type { Metadata } from "next";
import AdminDashboardClient from "./_components/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Overview",
  description: "School of Innovation admin dashboard — platform stats and overview.",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
