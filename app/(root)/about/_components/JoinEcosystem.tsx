import React from "react";
import {
  IconHeartHandshake,
  IconSchool,
  IconArrowRight,
} from "@tabler/icons-react";
import { Handshake } from "lucide-react";

export const JoinEcosystem = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-950 relative overflow-hidden">
      {/* Decorative Blur background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4">
            The Next Chapter
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to shape the <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              future of Africa?
            </span>
          </h3>
          <p className="text-gray-400 text-lg">
            Innovation 4.0 isn’t just an event you watch—it’s an ecosystem you
            build. Whether you are a brand, a leader, or a student, there is a
            place for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Option 1: Partner */}
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
            <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Handshake size={32} />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">
              Become a Partner
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Collaborate with us to empower thousands of founders. Align your
              brand with the pulse of African innovation.
            </p>
            <button className="flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
              Contact Partnership Team <IconArrowRight size={18} />
            </button>
          </div>

          {/* Option 2: Volunteer */}
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
            <div className="w-16 h-16 bg-orange-600/20 text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IconHeartHandshake size={32} />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">
              Join the Team
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Want to be part of the visionaries you just read about? Join our
              volunteer network and build your leadership skills.
            </p>
            <button className="flex items-center gap-2 text-orange-400 font-bold hover:text-orange-300 transition-colors">
              Apply to Volunteer <IconArrowRight size={18} />
            </button>
          </div>

          {/* Option 3: Student */}
          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
            <div className="w-16 h-16 bg-green-600/20 text-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <IconSchool size={32} />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">
              Start Learning
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Take the first step toward your own success story. Enroll in the
              School of Innovation today.
            </p>
            <button className="flex items-center gap-2 text-green-400 font-bold hover:text-green-300 transition-colors">
              Explore Courses <IconArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Foundation Credit */}
        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm max-w-xl mx-auto italic">
            "We are committed to equipping young Africans with the mindset,
            mentorship, and resources needed to build sustainable, high-impact
            ventures." — Cornerstone Intl. Foundation
          </p>
        </div>
      </div>
    </section>
  );
};
