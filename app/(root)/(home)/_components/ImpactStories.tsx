import React from "react";
import {
  IconQuote,
  IconArrowRight,
  IconMessage2,
  IconUsersGroup,
} from "@tabler/icons-react";

export const ImpactStories = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Visual/Stats */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80"
                  alt="Innovation Lab"
                  className="rounded-3xl h-64 w-full object-cover"
                />
                <div className="bg-orange-500 p-8 rounded-3xl text-white">
                  <IconUsersGroup size={40} className="mb-4 opacity-50" />
                  <p className="text-4xl font-black mb-1">5,000+</p>
                  <p className="font-medium opacity-90">
                    Lives Impacted since 2022
                  </p>
                </div>
              </div>
              <div className="pt-12 space-y-4">
                <div className="bg-blue-600 p-8 rounded-3xl text-white">
                  <h4 className="text-xl font-bold mb-2">90%</h4>
                  <p className="text-sm opacity-80 leading-snug">
                    Of attendees report gaining a new career-ready skill.
                  </p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80"
                  alt="Networking"
                  className="rounded-3xl h-64 w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side: The Featured Testimonial */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 tracking-widest uppercase text-sm">
              <IconMessage2 size={20} />
              Real Impact
            </div>

            <IconQuote size={56} className="text-gray-100 mb-4" />

            <blockquote className="mb-8">
              <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed italic">
                "I attended Innovation 2.0 as a student. Through the networking
                session, I met Ms. Samuel from ELAB Academy. That connection led
                to me becoming a Virtual Assistant for her team. It was truly
                life-changing!"
              </p>
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Ayanbola"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="text-lg font-bold text-gray-900">
                  Ayanbola Ayangbenro
                </h5>
                <p className="text-gray-500">
                  300L Student, Ajayi Crowther University
                </p>
              </div>
            </div>

            <button className="mt-10 flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all group">
              Read More Success Stories{" "}
              <IconArrowRight size={20} className="group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
