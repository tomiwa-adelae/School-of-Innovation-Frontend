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
