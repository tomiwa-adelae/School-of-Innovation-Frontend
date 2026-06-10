import type { Metadata } from "next";
import { Hero } from "../school/_components/Hero";
import { CategoryBrowser } from "../school/_components/CategoryBrowser";
import { TrendingCourses } from "../school/_components/TrendingCourses";
import { PlatformAdvantage } from "../school/_components/PlatformAdvantage";
import { AlumniSuccess } from "../school/_components/AlumniSuccess";
import { SchoolFinalCTA } from "../school/_components/SchoolFinalCTA";

export const metadata: Metadata = {
  title: "School of Innovation – Learn In-Demand Skills Online",
  description:
    "Explore all course categories, trending programmes, and the full platform at School of Innovation. From tech and design to business and creative arts — find the right course for your goals.",
  keywords: [
    "online courses Nigeria",
    "learn to code Nigeria",
    "tech skills",
    "design courses",
    "business courses",
    "certificate courses Nigeria",
    "School of Innovation",
  ],
  openGraph: {
    title: "School of Innovation – Learn In-Demand Skills Online",
    description:
      "Browse all course categories and trending programmes at School of Innovation. Find the perfect course to advance your career.",
    url: "https://innovationconference.com.ng",
  },
  alternates: { canonical: "https://innovationconference.com.ng" },
};

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
