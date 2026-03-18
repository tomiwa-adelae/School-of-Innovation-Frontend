import React from "react";
import {
  IconHistory,
  IconFlame,
  IconBolt,
  IconArrowRight,
} from "@tabler/icons-react";

export const LegacyTimeline = () => {
  const years = [
    {
      year: "2025",
      version: "Innovation 4.0",
      theme: "The Power of You",
      desc: "The focus shifted from innovation to action. We challenged founders to stop dreaming and start doing.",
      icon: <IconBolt className="text-primary" />,
      color: "border-primary",
    },
    {
      year: "2024",
      version: "Innovation 3.0",
      theme: "Building for the Future",
      desc: "The focus matured from dreams to systems. We challenged founders to stop chasing trends and start creating structures for long-term legacy.",
      icon: <IconBolt className="text-purple-500" />,
      color: "border-purple-500",
    },
    {
      year: "2023",
      version: "Innovation 2.0",
      theme: "Activating Your Potentials",
      desc: "A year of activation. We moved beyond inspiration to equip attendees with tools to shift the world through measurable impact.",
      icon: <IconFlame className="text-orange-500" />,
      color: "border-orange-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container">
        <div className="max-w-2xl mb-8">
          <h2 className="text-primary font-bold uppercase text-sm mb-2">
            Our Track Record
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900">
            A Legacy of <br />{" "}
            <span className="text-muted-foreground">Continuous Growth.</span>
          </h3>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map((item, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-md border-2 ${item.color} bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group`}
            >
              {/* Year Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">
                  {item.year}
                </span>
                <div className="p-3 bg-gray-50 rounded-md group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="text-primary font-bold text-xs uppercase">
                  {item.version}
                </h4>
                <h5 className="text-xl font-bold text-gray-900 leading-tight">
                  {item.theme}
                </h5>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {item.desc}
              </p>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <span>View Highlights</span>
                <IconArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* The "Future" Placeholder */}
        <div className="mt-12 p-8 rounded-md bg-gray-900 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h4 className="relative z-10 text-white font-bold text-xl italic">
            2026: Innovation 5.0 — The Next Chapter is Loading...
          </h4>
        </div>
      </div>
    </section>
  );
};
