import React from "react";
import {
  IconCode,
  IconDeviceLaptop,
  IconCpu,
  IconBrandGoogleAnalytics,
  IconArrowRight,
  IconAward,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const LearningPaths = () => {
  const tracks = [
    {
      title: "Web Development",
      description:
        "Master the MERN stack and build scalable web applications from scratch.",
      icon: <IconCode size={24} />,
      color: "blue",
      courses: "12 Courses",
    },
    {
      title: "Arduino & IoT",
      description:
        "Dive into hardware programming and build real-world smart devices.",
      icon: <IconCpu size={24} />,
      color: "orange",
      courses: "8 Courses",
    },
    {
      title: "Digital Marketing",
      description:
        "Learn brand strategy, SEO, and social media growth for the digital age.",
      icon: <IconBrandGoogleAnalytics size={24} />,
      color: "green",
      courses: "10 Courses",
    },
    {
      title: "Product Design",
      description:
        "Master UI/UX design thinking to create products users love.",
      icon: <IconDeviceLaptop size={24} />,
      color: "purple",
      courses: "6 Courses",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-primary font-semibold uppercase text-sm mb-4">
              Skill Up for the Future
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900">
              Master the Skills <br />{" "}
              <span className="text-gray-400">the World Demands.</span>
            </h3>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 text-primary rounded-2xl font-semibold text-sm border border-blue-100">
            <IconAward size={24} />
            <span>Industry-Recognized Certificates</span>
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="group p-8 rounded-md bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
            >
              <div
                className={`size-10 rounded-md flex items-center justify-center mb-8 transition-colors 
                ${track.color === "blue" ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : ""}
                ${track.color === "orange" ? "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" : ""}
                ${track.color === "green" ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white" : ""}
                ${track.color === "purple" ? "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white" : ""}
              `}
              >
                {track.icon}
              </div>

              <h4 className="text-xl font-semibold text-gray-900 mb-1.5">
                {track.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {track.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-muted-foreground">
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
          <Button>View All Specialized Tracks</Button>
        </div>
      </div>
    </section>
  );
};
