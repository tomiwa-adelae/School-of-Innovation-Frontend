import React from "react";
import {
  IconCheck,
  IconX,
  IconBrandWhatsapp,
  IconCircleNumber1,
  IconCircleNumber2,
  IconCircleNumber3,
} from "@tabler/icons-react";
import { ComingSoon } from "@/components/ComingSoon";

export const Pricing = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Innovation Path
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto italic">
            "The best investment you can make is in yourself."
          </p>
        </div>

        <div className="grid relative md:grid-cols-3 gap-8 mb-20">
          <ComingSoon />
          {/* Tier 1: Digital Learner */}
          <div className="bg-white p-8 rounded-md border border-gray-100 shadow-sm flex flex-col">
            <div className="mb-6">
              <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">
                School Access
              </span>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                Digital Pass
              </h3>
              <p className="text-gray-500 mt-4 text-sm">
                Perfect for those who want to master skills online at their own
                pace.
              </p>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-8">
              FREE{" "}
              <span className="text-sm font-normal text-gray-400">
                / Basic Courses
              </span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-gray-600">
                <IconCheck size={18} className="text-green-500" /> Access to
                Free Workshops
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <IconCheck size={18} className="text-green-500" /> Digital
                Certificate of Participation
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <IconX size={18} className="text-red-300" /> Physical Event Seat
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <IconX size={18} className="text-red-300" /> Premium LMS
                Mentorship
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition">
              Register Online
            </button>
          </div>

          {/* Tier 2: The Delegate (Most Popular) */}
          <div className="bg-blue-600 p-8 rounded-md shadow-xl shadow-blue-200 flex flex-col transform md:scale-110 z-10 text-white">
            <div className="mb-6">
              <span className="bg-white/20 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-widest">
                Most Popular
              </span>
              <h3 className="text-3xl font-black mt-4">Physical Delegate</h3>
              <p className="text-blue-100 mt-4 text-sm">
                The full 5.0 Experience. Networking, Live Sessions, and Awards.
              </p>
            </div>
            <div className="text-4xl font-black mb-8">
              ₦5,000{" "}
              <span className="text-sm font-normal opacity-70">
                / Early Bird
              </span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <IconCheck size={18} /> Reserved Seating in Lagos
              </li>
              <li className="flex items-center gap-3">
                <IconCheck size={18} /> Networking Lunch & Coffee
              </li>
              <li className="flex items-center gap-3">
                <IconCheck size={18} /> Exclusive Innovation Merch
              </li>
              <li className="flex items-center gap-3">
                <IconCheck size={18} /> 20% Discount on LMS Courses
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold bg-white text-blue-600 hover:bg-gray-100 transition shadow-lg">
              Get Your Ticket
            </button>
          </div>

          {/* Tier 3: Founder / VIP */}
          <div className="bg-white p-8 rounded-md border border-gray-100 shadow-sm flex flex-col">
            <div className="mb-6">
              <span className="text-orange-600 font-bold text-sm uppercase tracking-widest">
                Premium Impact
              </span>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                Founder Pass
              </h3>
              <p className="text-gray-500 mt-4 text-sm">
                For startups looking for funding, pitching, and executive
                networking.
              </p>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-8">
              ₦25,000
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-gray-600">
                <IconCheck size={18} className="text-green-500" /> VIP Lounge
                Access
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <IconCheck size={18} className="text-green-500" /> Pitch Session
                Slot
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <IconCheck size={18} className="text-green-500" /> All-Access
                School Pass (1 Yr)
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <IconCheck size={18} className="text-green-500" /> 1-on-1
                Mentorship
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl font-bold bg-gray-900 text-white hover:bg-black transition">
              Buy Founder Pass
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
