import type { Metadata } from "next";
import AdminCourseDetailClient from "./_components/AdminCourseDetailClient";

export const metadata: Metadata = {
  title: "Course Details",
  description: "View and manage course details on the School of Innovation admin panel.",
  robots: { index: false, follow: false },
};

export default function AdminCourseDetailPage() {
  return <AdminCourseDetailClient />;
}
