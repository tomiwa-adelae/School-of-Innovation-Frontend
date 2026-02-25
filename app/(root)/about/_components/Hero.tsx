import React from "react";
import {
  IconUsers,
  IconRocket,
  IconWorld,
  IconArrowDown,
} from "@tabler/icons-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-white overflow-hidden pt-20">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-20 z-0 hidden lg:block" />

      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-6">
            <IconRocket size={16} />
            <span>ESTABLISHED 2022</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-8">
            More than a conference. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              A startup empowerment movement.
            </span>
          </h1>

          {/* Manifesto Paragraph */}
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-10 max-w-2xl">
            We are the launchpad for Africa’s next wave of founders. Innovation
            4.0 is where creativity meets capital, and ambition meets execution.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-gray-100 pt-10">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <IconUsers size={20} />
                <span className="font-bold uppercase tracking-widest text-xs">
                  Community
                </span>
              </div>
              <p className="text-3xl font-black text-gray-900">5,000+</p>
              <p className="text-sm text-gray-500">Lives Impacted</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <IconWorld size={20} />
                <span className="font-bold uppercase tracking-widest text-xs">
                  Reach
                </span>
              </div>
              <p className="text-3xl font-black text-gray-900">Pan-African</p>
              <p className="text-sm text-gray-500">Network of Visionaries</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <IconRocket size={20} />
                <span className="font-bold uppercase tracking-widest text-xs">
                  Success
                </span>
              </div>
              <p className="text-3xl font-black text-gray-900">100+</p>
              <p className="text-sm text-gray-500">Startups Launched</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Image Composition (Right Side - Desktop Only) */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 w-[400px]">
        <img
          src="https://images.unsplash.com/photo-1523240715630-991f2e8113e6?auto=format&fit=crop&q=80"
          alt="Collaboration"
          className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-8 border-white"
        />
        <div className="bg-white p-6 rounded-2xl shadow-xl -translate-x-12 border border-gray-100">
          <p className="text-gray-900 font-bold">
            "We don't just talk about the future, we build it."
          </p>
          <span className="text-blue-600 text-sm font-medium">
            — John Ogunjide, Convener
          </span>
        </div>
      </div>

      {/* Scroll Down */}
      <div className="absolute bottom-8 left-6 hidden md:flex items-center gap-2 text-gray-400 font-bold text-xs tracking-[0.2em] uppercase vertical-text">
        <IconArrowDown size={14} />
        Our Story
      </div>
    </section>
  );
};
