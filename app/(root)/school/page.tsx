import React from "react";
import { Hero } from "./_components/Hero";
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
