import React from "react";
import {
  IconClock,
  IconChartBar,
  IconCertificate,
  IconUsers,
  IconPlayerPlay,
  IconStar,
  IconCircleCheck,
} from "@tabler/icons-react";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 bg-gray-950 overflow-hidden text-white">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent z-0" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Course Info */}
          <div className="lg:w-2/3">
            <nav className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <span>Courses</span>
              <span>/</span>
              <span>School of Engineering</span>
              <span>/</span>
              <span className="text-white">MERN Stack Mastery</span>
            </nav>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Master Full-Stack Web <br />
              Development with{" "}
              <span className="text-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                MERN.
              </span>
            </h1>

            <p className="text-gray-400 text-lg mb-10 max-w-2xl leading-relaxed">
              Go from zero to building production-ready SaaS applications. This
              intensive 12-week track covers MongoDB, Express, React, and
              Node.js with a focus on African fintech scale-up architecture.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                  <IconClock size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">
                    Duration
                  </p>
                  <p className="text-sm font-bold">12 Weeks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-orange-400">
                  <IconChartBar size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">
                    Level
                  </p>
                  <p className="text-sm font-bold">Intermediate</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-green-400">
                  <IconUsers size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">
                    Students
                  </p>
                  <p className="text-sm font-bold">1,240 Enrolled</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-400">
                  <IconCertificate size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">
                    Credential
                  </p>
                  <p className="text-sm font-bold">Verified Cert</p>
                </div>
              </div>
            </div>

            {/* Instructor Preview */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 w-fit">
              <img
                src="https://i.pravatar.cc/150?u=instructor"
                className="w-12 h-12 rounded-xl object-cover"
                alt="Instructor"
              />
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Lead Instructor
                </p>
                <p className="text-sm font-black">
                  Tomiwa Adelae <span className="text-blue-400 ml-2">✓</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Enrollment Card (Sticky-ready) */}
          <div className="lg:w-1/3 w-full lg:sticky lg:top-32">
            <div className="bg-white rounded-[2.5rem] p-8 text-gray-900 shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80"
                  alt="Video Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                    <IconPlayerPlay size={28} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white font-bold text-xs uppercase tracking-widest">
                  Preview Course
                </div>
              </div>

              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black text-gray-900">FREE</span>
                <span className="text-lg text-gray-400 line-through mb-1">
                  ₦45,000
                </span>
                <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-black italic">
                  SCHOLARSHIP TRACK
                </span>
              </div>

              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mb-6">
                Enroll Now
              </button>

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  This course includes:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <IconCircleCheck size={18} className="text-blue-600" /> 48
                    hours of on-demand video
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <IconCircleCheck size={18} className="text-blue-600" /> 12
                    Downloadable resources
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <IconCircleCheck size={18} className="text-blue-600" />{" "}
                    Private Discord community
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <IconCircleCheck size={18} className="text-blue-600" />{" "}
                    Final Capstone Project
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
