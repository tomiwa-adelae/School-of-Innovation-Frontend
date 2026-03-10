import React from "react";

export const Sponsors = () => {
  return (
    <div className="py-16 md:py-20 border-gray-200">
      <p className="text-center text-gray-400 font-medium text-sm uppercase mb-4">
        Ecosystem Partners
      </p>
      <div className="flex flex-wrap justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
        {/* Replace with actual partner logos */}
        <div className="font-bold text-lg md:text-2xl text-gray-400">
          CORNERSTONE
        </div>
        <div className="font-bold text-lg md:text-2xl text-gray-400">
          MSME AFRICA
        </div>
        <div className="font-bold text-lg md:text-2xl text-gray-400">
          ELAB ACADEMY
        </div>
        <div className="font-bold text-lg md:text-2xl text-gray-400">
          ECOWAS YOUTH
        </div>
      </div>
    </div>
  );
};
