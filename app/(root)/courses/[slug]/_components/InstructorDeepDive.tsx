import React from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconCertificate,
  IconQuote,
  IconCircleCheck,
} from "@tabler/icons-react";

export const InstructorDeepDive = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-gray-100 overflow-hidden relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-gray-900 hidden lg:block">
            <IconBrandGithub size={300} />
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
            {/* Left: Professional Photo & Links */}
            <div className="lg:w-1/3 text-center">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-6" />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
                  alt="Tomiwa Adelae"
                  className="relative w-64 h-80 object-cover rounded-[2.5rem] shadow-2xl"
                />
              </div>

              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <IconBrandGithub size={20} />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <IconBrandLinkedin size={20} />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                >
                  <IconBrandYoutube size={20} />
                </a>
              </div>
            </div>

            {/* Right: Bio & Expertise */}
            <div className="lg:w-2/3">
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold mb-4 uppercase tracking-widest text-xs">
                <IconCertificate size={18} />
                Your Lead Mentor
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-6">
                Tomiwa Adelae
              </h3>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  "Senior Engineer",
                  "Open Source Contributor",
                  "Ex-Google Mentor",
                  "SaaS Architect",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-lg border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed mb-10">
                <p>
                  With over 10 years of experience building scalable
                  applications for the African market, Tomiwa has lead
                  engineering teams at top fintech firms in Lagos and Nairobi.
                </p>
                <p>
                  He specializes in the <strong>MERN Stack</strong> and{" "}
                  <strong>Cloud Infrastructure</strong>. His goal is to move
                  students beyond "tutorial hell" by teaching them how to build
                  resilient, production-ready systems that can handle millions
                  of users.
                </p>
              </div>

              {/* Quote/Philosophy */}
              <div className="p-8 bg-gray-50 rounded-3xl border-l-4 border-blue-600 relative mb-10 italic text-gray-700">
                <IconQuote
                  className="absolute top-4 right-4 text-blue-200"
                  size={32}
                />
                "I don't just want you to write code; I want you to build
                products that solve actual African problems. That requires a
                different kind of engineering mindset."
              </div>

              {/* Achievements */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <IconCircleCheck className="text-green-500" size={20} />
                  <span className="text-sm font-bold text-gray-900">
                    5,000+ Students Taught
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IconCircleCheck className="text-green-500" size={20} />
                  <span className="text-sm font-bold text-gray-900">
                    100+ Live Projects Launched
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
