import React from "react";
import {
  IconRocket,
  IconPlayerPlay,
  IconStar,
  IconUsers,
  IconCircleCheck,
} from "@tabler/icons-react";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 bg-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: The Hook */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-6">
              <IconRocket size={18} />
              <span>AFRICA'S PREMIER TECH ACADEMY</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] mb-8">
              Don't just watch the future. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Build it.
              </span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-xl">
              The School of Innovation is a project-based learning ecosystem
              designed to turn curiosity into high-income tech skills. Master
              coding, design, and hardware with industry experts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
                Explore All Courses
              </button>
              <button className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <IconPlayerPlay size={20} fill="currentColor" />
                Watch How it Works
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 20}`}
                    className="w-12 h-12 rounded-full border-4 border-white object-cover"
                    alt="Student"
                  />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  +2k
                </div>
              </div>
              <div>
                <div className="flex text-orange-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Trusted by 2,000+ students across Africa
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Featured Course Card Mockup */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="relative h-64 bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80"
                  alt="Web Development"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-blue-600">
                  FEATURED TRACK
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Full-Stack Web Dev
                  </h3>
                  <p className="text-blue-600 font-black text-2xl">
                    ₦0.00{" "}
                    <span className="text-sm text-gray-400 line-through font-normal">
                      ₦50k
                    </span>
                  </p>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <IconCircleCheck size={18} className="text-green-500" />
                    12 Weeks of intensive training
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <IconCircleCheck size={18} className="text-green-500" />
                    Live Mentorship Sessions
                  </div>
                </div>
                <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
                  Start Learning Now
                </button>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <IconUsers size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">98%</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Job Placement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
