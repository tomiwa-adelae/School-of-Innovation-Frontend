import React from "react";
import {
  IconCode,
  IconCpu,
  IconPalette,
  IconSpeakerphone,
  IconArrowRight,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const CategoryBrowser = () => {
  const tracks = [
    {
      title: "School of Engineering",
      tagline: "Coding & Software",
      icon: <IconCode size={32} />,
      count: "12 Courses",
      color: "blue",
      skills: ["React", "Python", "Cloud Computing"],
    },
    {
      title: "School of Hardware",
      tagline: "Robotics & IoT",
      icon: <IconCpu size={32} />,
      count: "5 Courses",
      color: "orange",
      skills: ["Arduino", "Embedded Systems", "Circuitry"],
    },
    {
      title: "School of Creative Arts",
      tagline: "Design & UX",
      icon: <IconPalette size={32} />,
      count: "8 Courses",
      color: "pink",
      skills: ["Product Design", "Branding", "Motion"],
    },
    {
      title: "School of Business",
      tagline: "Marketing & Sales",
      icon: <IconSpeakerphone size={32} />,
      count: "10 Courses",
      color: "green",
      skills: ["SEO", "Digital Strategy", "Growth"],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        {/* Section Heading */}
        <div className="mb-8">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
            The Curriculum
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900">
            Four Schools.
            <span className="text-gray-400">One Mission.</span>
          </h3>
          <p className="text-base mt-2 text-muted-foreground flex items-center gap-2 font-medium">
            <IconUsers size={24} />
            Join 2,000+ students in these tracks
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-md border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
            >
              {/* Icon & Count */}
              <div className="flex justify-between items-start mb-8">
                <div
                  className={`w-14 h-14 rounded-md flex items-center justify-center transition-colors
                  ${track.color === "blue" ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : ""}
                  ${track.color === "orange" ? "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" : ""}
                  ${track.color === "pink" ? "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white" : ""}
                  ${track.color === "green" ? "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white" : ""}
                `}
                >
                  {track.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 bg-gray-50 px-3 py-1 rounded-full">
                  {track.count}
                </span>
              </div>

              {/* Text Content */}
              <p className="text-blue-600 font-bold text-xs uppercase tracking-tighter mb-1">
                {track.tagline}
              </p>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                {track.title}
              </h4>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {track.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[11px] font-semibold text-gray-400 border border-gray-100 px-2 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <Button className="w-full">
                View Tracks
                <IconArrowRight />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
