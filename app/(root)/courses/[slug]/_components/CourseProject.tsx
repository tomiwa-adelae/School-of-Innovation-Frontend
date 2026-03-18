import React from "react";
import {
  IconStack2,
  IconTrophy,
  IconCode,
  IconDatabase,
  IconBrandReact,
  IconBrandNodejs,
  IconCloudUpload,
  IconArrowRight,
} from "@tabler/icons-react";

export const CourseProject = () => {
  const tools = [
    {
      name: "React.js",
      icon: <IconBrandReact size={24} />,
      desc: "Frontend UI",
    },
    {
      name: "Node.js",
      icon: <IconBrandNodejs size={24} />,
      desc: "Server Runtime",
    },
    {
      name: "MongoDB",
      icon: <IconDatabase size={24} />,
      desc: "NoSQL Database",
    },
    { name: "AWS", icon: <IconCloudUpload size={24} />, desc: "Cloud Hosting" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left: Tech Stack */}
          <div className="lg:w-2/5">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-widest text-xs">
              <IconStack2 size={18} />
              The Tech Stack
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-8">
              Industry-Standard <br /> Tooling.
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {tools.map((tool, i) => (
                <div
                  key={i}
                  className="p-6 rounded-md border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
                >
                  <div className="text-gray-400 group-hover:text-blue-600 mb-4 transition-colors">
                    {tool.icon}
                  </div>
                  <h5 className="font-bold text-gray-900">{tool.name}</h5>
                  <p className="text-xs text-gray-500">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Capstone Project Showcase */}
          <div className="lg:w-3/5">
            <div className="relative bg-gray-900 rounded-md p-8 md:p-12 text-white overflow-hidden">
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <IconTrophy size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                      Final Milestone
                    </p>
                    <h4 className="text-2xl font-black italic">
                      The Capstone Project
                    </h4>
                  </div>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Build a "Real-World" Fintech Dashboard
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed max-w-xl">
                  You won't just build a 'Todo List'. For your final project,
                  you will architect a fully-functional Peer-to-Peer payment
                  dashboard with real-time transactions, user authentication,
                  and database persistence.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  <div className="flex items-start gap-3">
                    <IconCode
                      size={20}
                      className="text-blue-500 shrink-0 mt-1"
                    />
                    <p className="text-sm text-gray-300">
                      Clean, scalable MVC architecture
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconCode
                      size={20}
                      className="text-blue-500 shrink-0 mt-1"
                    />
                    <p className="text-sm text-gray-300">
                      Integration with Paystack API
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconCode
                      size={20}
                      className="text-blue-500 shrink-0 mt-1"
                    />
                    <p className="text-sm text-gray-300">
                      Responsive Mobile-First UI
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <IconCode
                      size={20}
                      className="text-blue-500 shrink-0 mt-1"
                    />
                    <p className="text-sm text-gray-300">
                      Live deployment on Vercel/AWS
                    </p>
                  </div>
                </div>

                <div className="p-1 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 inline-block">
                  <button className="bg-gray-900 px-8 py-4 rounded-[calc(1rem-1px)] font-bold flex items-center gap-2 hover:bg-transparent transition-all">
                    View Project Brief <IconArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
