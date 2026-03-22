import type { Metadata } from "next";
import AdminEnrollmentsClient from "./_components/AdminEnrollmentsClient";

export const metadata: Metadata = {
  title: "Enrollments",
  description: "View and manage all course enrollments on the School of Innovation platform.",
  robots: { index: false, follow: false },
};

export default function AdminEnrollmentsPage() {
  return <AdminEnrollmentsClient />;
}
