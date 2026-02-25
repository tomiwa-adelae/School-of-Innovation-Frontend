import React from "react";
import {
  IconSearch,
  IconFilter,
  IconLayoutGrid,
  IconBooks,
  IconBrandZapier,
} from "@tabler/icons-react";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-16 bg-white overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_15%_15%,#eff6ff_0%,transparent_40%)]" />

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-8 border border-blue-100">
            <IconBrandZapier size={14} className="fill-current" />
            <span>Discover your next skill</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight">
            The Innovation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              Course Library
            </span>
          </h1>

          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Browse through our curated selection of professional tracks. From
            coding to robotics, every course is built to move you closer to your
            goals.
          </p>

          {/* Search & Filter Bar */}
          <div className="relative max-w-3xl mx-auto bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-2 border border-gray-100 flex flex-col md:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <IconSearch
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="What do you want to learn today?"
                className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] text-gray-900 focus:outline-none placeholder:text-gray-400 font-medium"
              />
            </div>

            {/* Filter Button (Desktop) */}
            <div className="hidden md:flex items-center gap-2 px-6 py-5 border-l border-gray-100 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors">
              <IconFilter size={20} />
              <span className="font-bold text-sm">Filters</span>
            </div>

            {/* Search Button */}
            <button className="w-full md:w-auto bg-gray-900 text-white px-10 py-5 rounded-[1.5rem] font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
              Browse
            </button>
          </div>

          {/* Quick Stats/Tags */}
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
              <IconBooks size={18} />
              <span>50+ Courses</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
              <IconLayoutGrid size={18} />
              <span>12 Categories</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
              <IconBrandZapier size={18} />
              <span>Lifetime Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
