import React from "react";
import {
  IconCompass,
  IconChevronRight,
  IconSchool,
  IconBriefcase,
  IconRocket,
} from "@tabler/icons-react";

export const CourseFinder = () => {
  const personas = [
    {
      title: "The Beginner",
      desc: "New to tech? Start with our foundational tracks in Design or Web Basics.",
      icon: <IconSchool size={28} />,
      link: "#",
      color: "blue",
    },
    {
      title: "The Switcher",
      desc: "Ready to level up? Transition into Software Engineering or Data Marketing.",
      icon: <IconBriefcase size={28} />,
      link: "#",
      color: "orange",
    },
    {
      title: "The Founder",
      desc: "Building a product? Focus on Robotics, IoT, and Business Strategy.",
      icon: <IconRocket size={28} />,
      link: "#",
      color: "purple",
    },
  ];

  return (
    <section className="py-20 bg-gray-900 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />

      <div className="container relative z-10">
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side: Text */}
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-widest text-xs">
                <IconCompass size={18} />
                Not sure where to start?
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
                Let’s find the perfect <br />
                <span className="text-blue-600">track for you.</span>
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Answer a few questions about your goals, and we'll suggest the
                curriculum that fits your schedule and ambition.
              </p>
              <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2">
                Take the Path Finder Quiz <IconChevronRight size={18} />
              </button>
            </div>

            {/* Right side: Persona Cards */}
            <div className="space-y-4">
              {personas.map((persona, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-6 p-6 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer"
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 
                    ${persona.color === "blue" ? "bg-blue-100 text-blue-600" : ""}
                    ${persona.color === "orange" ? "bg-orange-100 text-orange-600" : ""}
                    ${persona.color === "purple" ? "bg-purple-100 text-purple-600" : ""}
                  `}
                  >
                    {persona.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {persona.title}
                    </h4>
                    <p className="text-sm text-gray-500">{persona.desc}</p>
                  </div>
                  <IconChevronRight
                    size={20}
                    className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Prefer to talk to a human?
            <button className="ml-2 text-blue-400 font-bold hover:underline">
              Chat with an Admissions Advisor
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};
