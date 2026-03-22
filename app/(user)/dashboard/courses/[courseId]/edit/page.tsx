import type { Metadata } from "next";
import EditCourseClient from "./_components/EditCourseClient";

export const metadata: Metadata = {
  title: "Edit Course",
  description: "Edit your course content and settings on School of Innovation.",
  robots: { index: false, follow: false },
};

export default function EditCoursePage() {
  return <EditCourseClient />;
}
