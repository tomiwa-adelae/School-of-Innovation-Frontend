import type { Metadata } from "next";
import CoursesClient from "./_components/CoursesClient";

export const metadata: Metadata = {
  title: "All Courses",
  description:
    "Browse hundreds of online courses in tech, design, business, data science, and more. Filter by category, level, or price. Start learning with School of Innovation today.",
  keywords: [
    "online courses",
    "learn online Nigeria",
    "tech courses",
    "data science courses",
    "design courses Nigeria",
    "affordable online courses",
    "certificate programmes",
  ],
  openGraph: {
    title: "All Courses | School of Innovation",
    description:
      "Browse hundreds of online courses in tech, design, business, and more. Find the perfect course and start learning today.",
    url: "https://innovationconference.com.ng/courses",
  },
  alternates: { canonical: "https://innovationconference.com.ng/courses" },
};

export default function CoursesPage() {
  return <CoursesClient />;
}
