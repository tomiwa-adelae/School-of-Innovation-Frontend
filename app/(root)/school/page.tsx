import type { Metadata } from "next";
import React from "react";
import { Hero } from "./_components/Hero";

export const metadata: Metadata = {
  title: "Explore the School",
  description:
    "Explore all course categories, trending programmes, and the full platform at School of Innovation. From tech and design to business and creative arts — find the right course for your goals.",
  keywords: [
    "explore courses",
    "course categories",
    "tech courses",
    "design courses",
    "business courses",
    "creative arts courses Nigeria",
    "School of Innovation catalogue",
  ],
  openGraph: {
    title: "Explore the School | School of Innovation",
    description:
      "Browse all course categories and trending programmes at School of Innovation. Find the perfect course to advance your career.",
    url: "https://innovationconference.com.ng/school",
  },
  alternates: { canonical: "https://innovationconference.com.ng/school" },
};
import { CategoryBrowser } from "./_components/CategoryBrowser";
import { TrendingCourses } from "./_components/TrendingCourses";
import { PlatformAdvantage } from "./_components/PlatformAdvantage";
import { AlumniSuccess } from "./_components/AlumniSuccess";
import { SchoolFinalCTA } from "./_components/SchoolFinalCTA";

const page = () => {
  return (
    <div>
      <Hero />
      <CategoryBrowser />
      <TrendingCourses />
      <PlatformAdvantage />
      <AlumniSuccess />
      <SchoolFinalCTA />
    </div>
  );
};

export default page;
