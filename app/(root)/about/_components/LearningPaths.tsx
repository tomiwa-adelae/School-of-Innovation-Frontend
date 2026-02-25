import React from "react";
import {
  IconCode,
  IconDeviceLaptop,
  IconCpu,
  IconBrandGoogleAnalytics,
  IconArrowRight,
  IconAward,
} from "@tabler/icons-react";

export const LearningPaths = () => {
  const tracks = [
    {
      title: "Web Development",
      description:
        "Master the MERN stack and build scalable web applications from scratch.",
      icon: <IconCode size={32} />,
      color: "blue",
      courses: "12 Courses",
    },
    {
      title: "Arduino & IoT",
      description:
        "Dive into hardware programming and build real-world smart devices.",
      icon: <IconCpu size={32} />,
      color: "orange",
      courses: "8 Courses",
    },
    {
      title: "Digital Marketing",
      description:
        "Learn brand strategy, SEO, and social media growth for the digital age.",
      icon: <IconBrandGoogleAnalytics size={32} />,
      color: "green",
      courses: "10 Courses",
    },
    {
      title: "Product Design",
      description:
        "Master UI/UX design thinking to create products users love.",
      icon: <IconDeviceLaptop size={32} />,
      color: "purple",
      courses: "6 Courses",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
              Skill Up for the Future
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Master the Skills <br />{" "}
              <span className="text-gray-400">the World Demands.</span>
            </h3>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl font-bold border border-blue-100">
            <IconAward size={24} />
            <span>Industry-Recognized Certificates</span>
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="group p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors 
                ${track.color === "blue" ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : ""}
                ${track.color === "orange" ? "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" : ""}
                ${track.color === "green" ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white" : ""}
                ${track.color === "purple" ? "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white" : ""}
              `}
              >
                {track.icon}
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {track.title}
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {track.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {track.courses}
                </span>
                <IconArrowRight
                  size={20}
                  className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl">
            View All Specialized Tracks
          </button>
        </div>
      </div>
    </section>
  );
};
