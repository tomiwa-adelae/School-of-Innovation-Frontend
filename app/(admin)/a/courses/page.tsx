import type { Metadata } from "next";
import AdminCoursesClient from "./_components/AdminCoursesClient";

export const metadata: Metadata = {
  title: "Manage Courses",
  description: "View and manage all courses on the School of Innovation platform.",
  robots: { index: false, follow: false },
};

export default function AdminCoursesPage() {
  return <AdminCoursesClient />;
}
