import type { Metadata } from "next";
import React from "react";
import { Hero } from "./_components/Hero";
import { FeaturesBridge } from "./_components/FeaturesBridge";
import { FeaturedCourses } from "./_components/FeaturedCourses";
import { ExpertSpotlight } from "./_components/ExpertSpotlight";
import { EventSchedule } from "./_components/EventSchedule";
import { ImpactStories } from "./_components/ImpactStories";
import { Pricing } from "./_components/Pricing";
import { Sponsors } from "@/components/Sponsors";
import { ClarityHub } from "./_components/ClarityHub";

export const metadata: Metadata = {
  title: "Learn In-Demand Skills Online",
  description:
    "Discover hundreds of courses in tech, design, business, and more. Learn from Nigeria's top instructors, earn industry-recognised certificates, and advance your career with School of Innovation.",
  keywords: [
    "online courses Nigeria",
    "learn to code Nigeria",
    "tech skills",
    "design courses",
    "business courses",
    "certificate courses Nigeria",
  ],
  openGraph: {
    title: "School of Innovation – Learn In-Demand Skills Online",
    description:
      "Discover hundreds of courses in tech, design, business, and more. Learn from Nigeria's top instructors and earn industry-recognised certificates.",
    url: "https://innovationconference.com.ng",
  },
};

const page = () => {
  return (
    <div>
      <Hero />
      <FeaturesBridge />
      <FeaturedCourses />
      <ExpertSpotlight />
      <EventSchedule />
      <ImpactStories />
      <Pricing />
      <Sponsors />
      <ClarityHub />
    </div>
  );
};

export default page;
