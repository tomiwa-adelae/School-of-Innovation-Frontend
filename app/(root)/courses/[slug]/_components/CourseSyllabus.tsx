import React from "react";
import {
  IconChevronDown,
  IconLock,
  IconPlayerPlay,
  IconFileText,
  IconTerminal2,
  IconCode,
} from "@tabler/icons-react";

export const CourseSyllabus = () => {
  const syllabus = [
    {
      phase: "Phase 1: Foundations",
      weeks: "Weeks 1-3",
      modules: [
        {
          title: "Introduction to Modern Javascript (ES6+)",
          duration: "4h 20m",
          type: "video",
        },
        {
          title: "Advanced CSS Layouts & Tailwind Integration",
          duration: "5h 10m",
          type: "video",
        },
        {
          title: "Building your first React Components",
          duration: "Lab Work",
          type: "project",
        },
      ],
    },
    {
      phase: "Phase 2: Backend Architecture",
      weeks: "Weeks 4-7",
      modules: [
        {
          title: "Node.js Environment & NPM Ecosystem",
          duration: "3h 45m",
          type: "video",
        },
        {
          title: "Express.js Routing & Middleware Mastery",
          duration: "6h 15m",
          type: "video",
        },
        {
          title: "Database Design with MongoDB & Mongoose",
          duration: "7h 00m",
          type: "video",
        },
      ],
    },
    {
      phase: "Phase 3: Integration & Security",
      weeks: "Weeks 8-10",
      modules: [
        {
          title: "JWT Authentication & Secure Cookies",
          duration: "5h 30m",
          type: "video",
        },
        {
          title: "State Management with Redux Toolkit",
          duration: "8h 20m",
          type: "video",
        },
        {
          title: "API Documentation with Swagger",
          duration: "2h 15m",
          type: "video",
        },
      ],
    },
    {
      phase: "Phase 4: The Capstone",
      weeks: "Weeks 11-12",
      modules: [
        {
          title: "Deploying to AWS & DigitalOcean",
          duration: "4h 00m",
          type: "video",
        },
        {
          title: "Final Project: Building a Fintech Dashboard",
          duration: "Final Exam",
          type: "project",
        },
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="max-w-4xl">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
            Curriculum
          </h2>
          <h3 className="text-4xl font-black text-gray-900 mb-12">
            What you’ll <span className="text-gray-400">master.</span>
          </h3>

          <div className="space-y-6">
            {syllabus.map((section, idx) => (
              <div
                key={idx}
                className="border border-gray-100 rounded-md overflow-hidden shadow-sm"
              >
                {/* Section Header */}
                <div className="bg-gray-50 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">
                      {section.weeks}
                    </p>
                    <h4 className="text-xl font-bold text-gray-900">
                      {section.phase}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <span>{section.modules.length} Modules</span>
                    <IconChevronDown size={20} />
                  </div>
                </div>

                {/* Module List */}
                <div className="p-4 md:p-6 bg-white space-y-2">
                  {section.modules.map((module, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-gray-300 group-hover:text-blue-500 transition-colors">
                          {module.type === "video" ? (
                            <IconPlayerPlay size={18} />
                          ) : (
                            <IconTerminal2 size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {module.title}
                          </p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                            {module.type} <span className="opacity-30">•</span>{" "}
                            {module.duration}
                          </p>
                        </div>
                      </div>
                      {/* Only first module unlocked for preview */}
                      {idx === 0 && mIdx === 0 ? (
                        <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          FREE PREVIEW
                        </span>
                      ) : (
                        <IconLock size={16} className="text-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-blue-600/5 rounded-md border border-blue-600/10 flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-md flex items-center justify-center shrink-0">
              <IconCode size={32} />
            </div>
            <div>
              <h5 className="font-bold text-gray-900">
                Weekly Coding Challenges
              </h5>
              <p className="text-sm text-gray-600">
                Every Friday, you'll receive a real-world brief to implement
                solo or in a pair-programming session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
