import type { Metadata } from "next";
import React from "react";
import { Hero } from "./_components/Hero";
import { PurposePillars } from "./_components/PurposePillars";
import { LegacyTimeline } from "./_components/LegacyTimeline";
import { LearningPaths } from "./_components/LearningPaths";
import { LearningFlow } from "./_components/LearningFlow";
import { TeamSection } from "./_components/TeamSection";
import { InstructorSpotlight } from "./_components/InstructorSpotlight";
import { CertificationShowcase } from "./_components/CertificationShowcase";
import { JoinEcosystem } from "./_components/JoinEcosystem";
import { Sponsors } from "@/components/Sponsors";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about School of Innovation — our mission, story, team, and the movement we are building to empower the next generation of African innovators through world-class education.",
  keywords: [
    "about School of Innovation",
    "Nigerian edtech company",
    "our mission",
    "innovation education Nigeria",
    "edtech Africa",
  ],
  openGraph: {
    title: "About Us | School of Innovation",
    description:
      "Meet the team behind Nigeria's leading online learning platform. We are building the next generation of African innovators.",
    url: "https://innovationconference.com.ng/about",
  },
  alternates: { canonical: "https://innovationconference.com.ng/about" },
};

const page = () => {
  return (
    <div className="bg-white">
      {/* PHASE 1: THE STORY (Why we exist) */}
      <Hero />
      <PurposePillars />
      <LegacyTimeline />

      {/* PHASE 2: THE ACADEMY (How we solve the problem now) */}
      {/* We transition from "History" to "Active Learning" */}
      <LearningPaths />
      <LearningFlow />

      {/* PHASE 3: THE AUTHORITY (The faces behind the work) */}
      <TeamSection />
      <CertificationShowcase />
      <InstructorSpotlight />

      {/* PHASE 5: THE CONVERSION (Final call to action) */}
      <JoinEcosystem />
      <Sponsors />
    </div>
  );
};

export default page;
