import type { Metadata } from "next";
import { Hero } from "../(home)/_components/Hero";
import { FeaturesBridge } from "../(home)/_components/FeaturesBridge";
import { FeaturedCourses } from "../(home)/_components/FeaturedCourses";
import { ExpertSpotlight } from "../(home)/_components/ExpertSpotlight";
import { EventSchedule } from "../(home)/_components/EventSchedule";
import { ImpactStories } from "../(home)/_components/ImpactStories";
import { Pricing } from "../(home)/_components/Pricing";
import { Sponsors } from "@/components/Sponsors";
import { ClarityHub } from "../(home)/_components/ClarityHub";

export const metadata: Metadata = {
  title: "Innovation Conference 5.0",
  description:
    "Relive Innovation Conference 5.0 — Africa's premier gathering of founders, builders, and visionaries. Explore highlights, speakers, and what's next.",
  openGraph: {
    title: "Innovation Conference 5.0 | School of Innovation",
    description:
      "Africa's premier innovation conference for founders and builders.",
    url: "https://innovationconference.com.ng/conference",
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
