"use client";
import React, { useState } from "react";
import {
  IconClock,
  IconMapPin,
  IconCoffee,
  IconMicrophone,
  IconTrophy,
  IconMovie,
} from "@tabler/icons-react";

export const EventSchedule = () => {
  const schedule = [
    {
      time: "11:00 AM",
      title: "Red Carpet & Check-in",
      desc: "Network with early arrivals and capture the moment at our innovation media wall.",
      icon: <IconMovie size={24} />,
      color: "bg-purple-500",
    },
    {
      time: "12:00 PM",
      title: "The Grand Opening",
      desc: "Welcome address, spoken word performances, and the Innovation 4.0 vision cast.",
      icon: <IconMicrophone size={24} />,
      color: "bg-blue-500",
    },
    {
      time: "01:30 PM",
      title: "Startup Panel Session",
      desc: "Real talk with founders on tackling Africa's biggest challenges using technology.",
      icon: <IconClock size={24} />,
      color: "bg-orange-500",
    },
    {
      time: "02:45 PM",
      title: "Awards & Recognition",
      desc: "Honoring the changemakers and celebrating the top innovators of the year.",
      icon: <IconTrophy size={24} />,
      color: "bg-yellow-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              The <span className="text-blue-500">Innovation</span> Roadmap
            </h2>
            <p className="text-gray-400 text-lg">
              A carefully curated journey designed to transform your mindset
              from a dreamer to a doer. Everything from networking to
              high-octane performances.
            </p>
          </div>
          <div className="bg-white/5 border hidden md:flex border-white/10 p-4 rounded-2xl items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <IconMapPin size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Main Stage Venue</p>
              <p className="font-bold">Lagos Innovation Hub</p>
            </div>
          </div>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-12 space-y-6">
          {schedule.map((item, index) => (
            <div key={index} className="relative pl-4 md:pl-10 group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full border-4 border-gray-900 ${item.color} group-hover:scale-125 transition-transform`}
              />

              <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl hover:bg-white/[0.08] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-xl text-white ${item.color}`}>
                      {item.icon}
                    </span>
                    <span className="text-blue-400 font-bold text-base">
                      {item.time}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-base max-w-2xl leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
