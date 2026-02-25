import React from "react";
import {
  IconSearch,
  IconFileCertificate,
  IconShare,
  IconRosette,
} from "@tabler/icons-react";

export const CertificationShowcase = () => {
  return (
    <section className="py-24 bg-gray-950 text-white overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Certificate Mockup */}
          <div className="lg:w-1/2 relative group">
            {/* Glow effect behind certificate */}
            <div className="absolute inset-0 bg-blue-600/30 blur-[100px] rounded-full group-hover:bg-blue-500/40 transition-all" />

            <div className="relative bg-white p-4 md:p-8 rounded-lg shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-700">
              {/* This is a CSS representation of the certificate */}
              <div className="border-[12px] border-double border-gray-200 p-6 md:p-10 text-gray-900 text-center">
                <IconFileCertificate
                  size={60}
                  className="mx-auto text-blue-600 mb-6"
                />
                <h4 className="font-serif text-3xl mb-2">
                  Certificate of Excellence
                </h4>
                <p className="text-gray-500 text-sm uppercase tracking-[0.2em] mb-8">
                  This is to certify that
                </p>
                <p className="font-serif text-4xl border-b-2 border-gray-100 pb-2 mb-8">
                  Your Name Here
                </p>
                <p className="text-gray-600 max-w-sm mx-auto mb-10">
                  Has successfully completed the professional track in
                  <span className="font-bold"> Modern Web Development </span>
                  offered by the School of Innovation.
                </p>
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">
                      ID: SOI-2026-X892
                    </p>
                    <div className="w-20 h-1 bg-gray-900 mt-2" />
                    <p className="text-[10px] font-bold mt-1">
                      John Ogunjide, Convener
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                    SEAL
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Value Proposition */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 text-blue-400 font-bold mb-6 tracking-widest uppercase text-sm">
              <IconRosette size={20} />
              Validated Excellence
            </div>

            <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              A Credential that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Opens Doors.
              </span>
            </h3>

            <div className="space-y-8">
              {/* Feature 1 */}
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-blue-400">
                  <IconSearch size={24} />
                </div>
                <div>
                  <h5 className="text-xl font-bold mb-2">
                    Instant Verification
                  </h5>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Every certificate comes with a unique ID and a QR code.
                    Employers can verify your skills instantly on our platform.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-orange-400">
                  <IconShare size={24} />
                </div>
                <div>
                  <h5 className="text-xl font-bold mb-2">
                    LinkedIn Integrated
                  </h5>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    One-click add to your LinkedIn profile. Showcase your
                    expertise to recruiters and the global tech community.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
              <p className="text-blue-200 text-sm italic">
                "Our graduates have gone on to work at top tech firms in Lagos
                and remotely for international startups."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
