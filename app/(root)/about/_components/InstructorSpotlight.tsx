import React from "react";
import {
  IconBrandLinkedin,
  IconUsers,
  IconStar,
  IconBadge,
} from "@tabler/icons-react";

export const InstructorSpotlight = () => {
  const instructors = [
    {
      name: "Tomiwa Adelae",
      specialty: "Full-Stack Development",
      credential: "Lead Dev @ Innovation 4.0",
      students: "1,200+",
      image:
        "https://innovationconference.com.ng/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdh0rc6p1c%2Fimage%2Fupload%2Fv1744311465%2Finnovation%2Forganizer%2Ftomiwa-adelae_khh1k4.jpg&w=2048&q=75",
      rating: "4.9",
    },
    {
      name: "Shade Akinteye",
      specialty: "Project-Based Learning",
      credential: "Coordinator, School of Innovation",
      students: "850+",
      image:
        "https://innovationconference.com.ng/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdh0rc6p1c%2Fimage%2Fupload%2Fv1744311935%2Finnovation%2Forganizer%2FWhatsApp_Image_2025-04-10_at_20.04.42_2d7d0f47_fig9tg.jpg&w=2048&q=75",
      rating: "5.0",
    },
    {
      name: "Iranwo A. Opadoja",
      specialty: "Creative Direction & UX",
      credential: "Lead Creative @ Cornerstone",
      students: "2,100+",
      image:
        "https://innovationconference.com.ng/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdh0rc6p1c%2Fimage%2Fupload%2Fv1744738802%2Finnovation%2Forganizer%2FDSC_0531_xwdjsb.jpg&w=2048&q=75",
      rating: "4.8",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <h2 className="text-primary font-semibold uppercase text-sm mb-2">
            World-Class Mentorship
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Learn from those who{" "}
            <span className="text-gray-400">actually build.</span>
          </h3>
          <p className="text-gray-600 text-lg">
            Our instructors aren't just academics. They are the engineers,
            designers, and strategists currently shaping the African tech
            ecosystem.
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {instructors.map((mentor, index) => (
            <div
              key={index}
              className="group relative bg-gray-50 rounded-md p-8 hover:bg-primary transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />

              <div className="relative z-10">
                {/* Image & Stats */}
                <div className="flex items-start justify-between mb-8">
                  <div className="w-24 h-24 rounded-md overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-orange-500 group-hover:text-white font-bold">
                      <IconStar size={16} fill="currentColor" />
                      <span>{mentor.rating}</span>
                    </div>
                    <div className="text-xs text-gray-400 group-hover:text-blue-100 font-medium mt-1 uppercase tracking-widest">
                      Instructor Rating
                    </div>
                  </div>
                </div>

                {/* Name & Title */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors">
                      {mentor.name}
                    </h4>
                    <IconBadge
                      size={20}
                      className="text-blue-500 group-hover:text-blue-200"
                    />
                  </div>
                  <p className="text-primary group-hover:text-blue-100 font-bold text-sm tracking-tight">
                    {mentor.specialty}
                  </p>
                  <p className="text-gray-500 group-hover:text-blue-200 text-xs mt-2 italic">
                    {mentor.credential}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 group-hover:border-white/20">
                  <div className="flex items-center gap-2 text-gray-500 group-hover:text-white">
                    <IconUsers size={18} />
                    <span className="text-sm font-bold">
                      {mentor.students} Students
                    </span>
                  </div>
                  <a
                    href="#"
                    className="p-2 bg-white rounded-xl text-blue-600 hover:bg-gray-100 transition-colors"
                  >
                    <IconBrandLinkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mentorship Note */}
        <div className="mt-10 bg-blue-50 rounded-md p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm font-black">
              ?
            </div>
            <p className="text-blue-900 font-medium">
              Want to join our global network of instructors?
            </p>
          </div>
          <button className="text-blue-600 font-bold border-b-2 border-blue-600 hover:text-blue-800 transition-colors">
            Apply to Teach at School of Innovation
          </button>
        </div>
      </div>
    </section>
  );
};
