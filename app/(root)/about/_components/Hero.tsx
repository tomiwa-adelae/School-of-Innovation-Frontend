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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs md:text-sm font-semibold mb-6">
            <IconRocket size={16} />
            <span>ESTABLISHED 2022</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            More than a conference. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              A startup empowerment movement.
            </span>
          </h1>

          {/* Manifesto Paragraph */}
          <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
            We are the launchpad for Africa’s next wave of founders. Innovation
            4.0 is where creativity meets capital, and ambition meets execution.
          </p>
        </div>
      </div>

      {/* Floating Image Composition (Right Side - Desktop Only) */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 w-[400px]">
        <img
          src="https://res.cloudinary.com/dh0rc6p1c/image/upload/v1744308706/innovation/DSC_1397-Joe_Photography_zvroub.jpg"
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
    </section>
  );
};
