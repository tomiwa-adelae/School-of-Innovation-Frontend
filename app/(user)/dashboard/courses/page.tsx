import type { Metadata } from "next";
import CoursesClient from "./_components/CoursesClient";

export const metadata: Metadata = {
  title: "My Courses",
  description: "View and manage all courses you have enrolled in on School of Innovation.",
  robots: { index: false, follow: false },
};

export default function MyCoursesPage() {
  return <CoursesClient />;
}
