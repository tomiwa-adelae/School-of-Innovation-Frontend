import React from "react";
import {
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
  IconUsersGroup,
} from "@tabler/icons-react";

export const TeamSection = () => {
  const leadership = [
    {
      name: "John Ogunjide",
      role: "Convener",
      bio: "Visionary leader and advocate for personal transformation. John founded the conference to bridge the gap between thinkers and changemakers.",
      image: "https://via.placeholder.com/400x500", // Replace with actual
    },
    {
      name: "Chidubem Anokwute",
      role: "President",
      bio: "Leading the strategic execution of Innovation Conference at the institutional level with a focus on startup growth.",
      image: "https://via.placeholder.com/400x500",
    },
    {
      name: "Gift Faleye",
      role: "Global Director",
      bio: "Driving international partnerships and expanding the footprint of the Innovation movement across borders.",
      image: "https://via.placeholder.com/400x500",
    },
  ];

  const departments = [
    {
      name: "Speakers Management",
      leads: ["Blessing Onafowokan", "Tomi Oluyamo"],
    },
    {
      name: "Media & Creative",
      leads: ["Sallie Uju-Njoku", "Iranwo A. Opadoja", "Eyitayo Akinwale"],
    },
    {
      name: "Sponsorship & PR",
      leads: ["Enashinere Alli", "Oyinkansola Ogunsanya"],
    },
    {
      name: "LMS & School",
      leads: ["Shade Akinteye", "Kemi Akinteye", "Tomiwa Adelae"],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">
            The People Behind the Movement
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Built by <span className="text-gray-400">Visionaries.</span>
          </h3>
          <p className="max-w-2xl mx-auto text-gray-600 italic">
            "Coming together is a beginning; keeping together is progress;
            working together is success."
          </p>
        </div>

        {/* Executive Leadership Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-24">
          {leadership.map((member, index) => (
            <div
              key={index}
              className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-3">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-blue-600 transition">
                      <IconBrandLinkedin size={20} />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-blue-400 transition">
                      <IconBrandTwitter size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h4>
                <p className="text-blue-600 font-bold text-sm mb-4 uppercase tracking-tighter">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Departmental Grid */}
        <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <IconUsersGroup size={24} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900">
              Departmental Leadership
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {departments.map((dept, index) => (
              <div key={index}>
                <h5 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 border-b border-blue-50 pb-2">
                  {dept.name}
                </h5>
                <ul className="space-y-3">
                  {dept.leads.map((lead, idx) => (
                    <li
                      key={idx}
                      className="text-gray-800 font-semibold text-sm hover:text-blue-600 cursor-default transition-colors"
                    >
                      {lead}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t border-gray-50 text-center">
            <p className="text-gray-400 text-sm">
              And a dedicated team of 20+ volunteers making the vision a
              reality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
