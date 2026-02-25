import React from "react";
import {
  IconTargetArrow,
  IconEye,
  IconGrowth,
  IconTarget,
} from "@tabler/icons-react";

export const PurposePillars = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: The "Why" */}
          <div className="lg:w-1/3">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">
              Our Foundation
            </h2>
            <h3 className="text-4xl font-black text-gray-900 leading-tight mb-6">
              Bridging the gap between{" "}
              <span className="text-gray-400">Ambition</span> and{" "}
              <span className="text-blue-600">Impact.</span>
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              Backed by **Cornerstone International Foundation**, we are
              building a thriving community of problem-solvers. We aren't just
              hosting a meeting; we are cultivating the foundation for African
              solutions to shape the global narrative.
            </p>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm italic text-gray-500">
                "We envision a continent where startups born out of curiosity
                redefine industries and create jobs."
              </p>
            </div>
          </div>

          {/* Right: The Pillars Grid */}
          <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-blue-100">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <IconTargetArrow size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                To empower Africa’s next generation of innovators by providing
                the tools, mentorship, and ecosystem needed to build scalable
                startups. We bridge creativity, technology, and purpose to
                transform bold ideas into sustainable ventures.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-orange-100">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <IconEye size={32} />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                To build Africa’s most vibrant innovation ecosystem—one where
                every young visionary has access to the resources needed to turn
                curiosity into collaboration, redefining industries and driving
                inclusive growth across the continent.
              </p>
            </div>

            {/* The Extra Pillar: Community */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-purple-100 md:col-span-2">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <IconGrowth size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Sustainable Growth
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    Our commitment goes beyond hosting conferences; we build
                    capacity. Through the **School of Innovation**, we equip
                    youth with real-world skills like Web Development and
                    Arduino Programming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
