import type { Metadata } from "next";
import CreateCourseClient from "./_components/CreateCourseClient";

export const metadata: Metadata = {
  title: "Create Course",
  description: "Create and publish a new course on School of Innovation.",
  robots: { index: false, follow: false },
};

export default function CreateCoursePage() {
  return <CreateCourseClient />;
}
