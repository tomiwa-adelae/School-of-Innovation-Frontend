import React from "react";
import {
  IconTargetArrow,
  IconSchool,
  IconCamera,
  IconMap2,
  IconExternalLink,
} from "@tabler/icons-react";

export const ContactChannels = () => {
  const departments = [
    {
      name: "Sponsorship & Partnerships",
      email: "partnership@innovationconference.com.ng",
      desc: "For brands looking to align with the School of Innovation movement.",
      icon: <IconTargetArrow size={24} />,
      color: "text-primary",
    },
    {
      name: "School of Innovation",
      email: "admissions@innovationconference.com.ng",
      desc: "Questions about courses, certificates, or LMS student access.",
      icon: <IconSchool size={24} />,
      color: "text-orange-600",
    },
    {
      name: "Media & Press",
      email: "media@innovationconference.com.ng",
      desc: "Inquiries regarding interviews, press passes, and event coverage.",
      icon: <IconCamera size={24} />,
      color: "text-green-600",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-2 mb-10">
          {departments.map((dept, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-md shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className={`mb-6 ${dept.color}`}>{dept.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {dept.name}
              </h4>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                {dept.desc}
              </p>
              <a
                href={`mailto:${dept.email}`}
                className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
              >
                {dept.email} <IconExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* Location / Map Section */}
        <div className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-widest text-xs">
              <IconMap2 size={18} />
              Physical Presence
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-6">
              Based in the heart of <br /> Nigerian Innovation.
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              While our school is global and our movement is pan-African, our
              headquarters are located in Lagos—the bustling tech hub of the
              continent.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="font-bold text-gray-900">Headquarters:</div>
                <div className="text-gray-600">
                  Lagos Innovation Hub, Victoria Island, Lagos.
                </div>
              </div>
              <div className="flex gap-4">
                <div className="font-bold text-gray-900">Hours:</div>
                <div className="text-gray-600">
                  Mon - Fri: 9:00 AM - 5:00 PM
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for Map - In a real app, use Google Maps iframe or Mapbox */}
          <div className="md:w-1/2 h-[400px] md:h-auto bg-gray-200 relative group">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80"
              alt="Lagos Map View"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform">
                Open in Google Maps <IconExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
