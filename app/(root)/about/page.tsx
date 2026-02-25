// import React from "react";
// import { Hero } from "./_components/Hero";
// import { PurposePillars } from "./_components/PurposePillars";
// import { LegacyTimeline } from "./_components/LegacyTimeline";
// import { TeamSection } from "./_components/TeamSection";
// import { JoinEcosystem } from "./_components/JoinEcosystem";
// import { LearningPaths } from "./_components/LearningPaths";
// import { LearningFlow } from "./_components/LearningFlow";
// import { InstructorSpotlight } from "./_components/InstructorSpotlight";
// import { CertificationShowcase } from "./_components/CertificationShowcase";

// const page = () => {
//   return (
//     <div>
//       <Hero />
//       <PurposePillars />
//       <LegacyTimeline />
//       <TeamSection />
//       <JoinEcosystem />
//       <LearningPaths />
//       <LearningFlow />
//       <InstructorSpotlight />
//       <CertificationShowcase />
//     </div>
//   );
// };

// export default page;

import React from "react";
import { Hero } from "./_components/Hero";
import { PurposePillars } from "./_components/PurposePillars";
import { LegacyTimeline } from "./_components/LegacyTimeline";
// 1. Move LearningPaths & LearningFlow here to show the "Evolution"
import { LearningPaths } from "./_components/LearningPaths";
import { LearningFlow } from "./_components/LearningFlow";
// 2. Introduce the people who make it happen
import { TeamSection } from "./_components/TeamSection";
import { InstructorSpotlight } from "./_components/InstructorSpotlight";
// 3. The proof of value
import { CertificationShowcase } from "./_components/CertificationShowcase";
// 4. The final invitation
import { JoinEcosystem } from "./_components/JoinEcosystem";
import { Sponsors } from "@/components/Sponsors";

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
