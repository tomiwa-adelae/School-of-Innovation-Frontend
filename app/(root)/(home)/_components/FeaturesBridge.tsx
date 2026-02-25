import React from "react";
import {
  IconDeviceLaptop,
  IconCalendarEvent,
  IconArrowRight,
  IconCircleCheck,
} from "@tabler/icons-react";

export const FeaturesBridge = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Beyond the Conference
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Innovation 4.0 is a moment; the School of Innovation is a movement.
            Whether you're here for the live energy or the deep-dive skills,
            we’ve got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Path 1: The Event */}
          <div className="group p-6 md:p-8 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-blue-600 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
              <IconCalendarEvent size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-black group-hover:text-white">
              The Live Experience
            </h3>
            <p className="text-gray-600 mb-6 group-hover:text-blue-100">
              Join 2,000+ visionaries in Lagos. Networking, pitch competitions,
              and keynote sessions that spark lifelong collaborations.
            </p>
            <ul className="space-y-3 mb-8 text-gray-500 group-hover:text-blue-50">
              <li className="flex items-center gap-2 font-medium">
                <IconCircleCheck
                  size={18}
                  className="text-blue-500 group-hover:text-white"
                />{" "}
                25+ Visionary Speakers
              </li>
              <li className="flex items-center gap-2 font-medium">
                <IconCircleCheck
                  size={18}
                  className="text-blue-500 group-hover:text-white"
                />{" "}
                Startup Pitch Hub
              </li>
            </ul>
            <button className="flex items-center gap-2 font-bold text-blue-600 group-hover:text-white underline-offset-4 hover:underline">
              View Event Agenda <IconArrowRight size={18} />
            </button>
          </div>

          {/* Path 2: The School (LMS) */}
          <div className="group p-6 md:p-8 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-orange-500 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
              <IconDeviceLaptop size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-black group-hover:text-white">
              School of Innovation
            </h3>
            <p className="text-gray-600 mb-6 group-hover:text-orange-50">
              Don't wait for the event. Start building today with our
              professional LMS. Self-paced courses designed for the African tech
              landscape.
            </p>
            <ul className="space-y-3 mb-8 text-gray-500 group-hover:text-orange-50">
              <li className="flex items-center gap-2 font-medium">
                <IconCircleCheck
                  size={18}
                  className="text-orange-500 group-hover:text-white"
                />{" "}
                Web Dev & Arduino Tracks
              </li>
              <li className="flex items-center gap-2 font-medium">
                <IconCircleCheck
                  size={18}
                  className="text-orange-500 group-hover:text-white"
                />{" "}
                Verified Certifications
              </li>
            </ul>
            <button className="flex items-center gap-2 font-bold text-orange-600 group-hover:text-white underline-offset-4 hover:underline">
              Browse All Courses <IconArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
