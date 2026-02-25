import React from "react";
import {
  IconBrandLinkedin,
  IconBrandTwitter,
  IconCertificate,
} from "@tabler/icons-react";

export const ExpertSpotlight = () => {
  const experts = [
    {
      name: "Mr. Seye Olurotimi",
      role: "Founder, MSME Africa",
      expertise: "Business Growth & MSME Strategy",
      image:
        "https://innovationconference.com.ng/wp-content/uploads/2024/07/Seye-Olurotimi.jpg", // Using your existing assets
      type: "Keynote Speaker",
    },
    {
      name: "John Ogunjide",
      role: "Convener, Innovation 4.0",
      expertise: "Personal Transformation & Tech",
      image: "https://via.placeholder.com/400x500", // Placeholder for new professional shots
      type: "LMS Instructor",
    },
    {
      name: "Emmanuel Agida",
      role: "ECOWAS Youth Ambassador",
      expertise: "Leadership & Global Impact",
      image: "https://via.placeholder.com/400x500",
      type: "Guest Speaker",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Learn from the{" "}
              <span className="text-blue-600">Architects of Innovation</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Our speakers and instructors aren't just theorists—they are
              founders, ambassadors, and tech pioneers building the future of
              Africa.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
              <IconCertificate size={20} />
              25+ Visionary Experts
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {experts.map((expert, index) => (
            <div key={index} className="group relative">
              {/* Image Container */}
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-6">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-blue-600 transition"
                    >
                      <IconBrandLinkedin size={20} />
                    </a>
                    <a
                      href="#"
                      className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-blue-400 transition"
                    >
                      <IconBrandTwitter size={20} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                  {expert.type}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {expert.name}
                </h3>
                <p className="text-gray-500 font-medium">{expert.role}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <span className="h-px w-8 bg-gray-200"></span>
                  {expert.expertise}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
