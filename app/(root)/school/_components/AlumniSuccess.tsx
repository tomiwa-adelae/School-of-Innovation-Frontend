import React from "react";
import {
  IconQuote,
  IconBrandLinkedin,
  IconBriefcase,
  IconMapPin,
} from "@tabler/icons-react";

export const AlumniSuccess = () => {
  const stories = [
    {
      name: "Chidimma Okoro",
      outcome: "UI/UX Designer @ Kuda",
      text: "The School of Innovation didn't just teach me tools; they taught me how to think like a designer. I went from zero knowledge to a full-time role in 6 months.",
      image: "https://i.pravatar.cc/150?u=chi",
      edition: "Innovation 3.0 Alumni",
    },
    {
      name: "Samuel Adebayo",
      outcome: "Founder, AgriTech Solutions",
      text: "I built my first hardware prototype during the Arduino track. The mentorship from John and the team was the bridge I needed to launch my startup.",
      image: "https://i.pravatar.cc/150?u=sam",
      edition: "Innovation 2.0 Alumni",
    },
    {
      name: "Fatima Yusuf",
      outcome: "Remote Frontend Dev",
      text: "Learning MERN stack here was the best decision of 2024. The community is so supportive; I still reach out to my mentors today.",
      image: "https://i.pravatar.cc/150?u=fatima",
      edition: "Innovation 3.0 Alumni",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-primary font-semibold uppercase text-xs mb-4">
            The Result of Innovation
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Real People. <span className="text-gray-400">Real Careers.</span>
          </h3>
          <p className="text-gray-500 max-w-2xl mx-auto italic">
            "Our greatest success is seeing our students solve real-world
            problems using the skills they learned here."
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-2">
          {stories.map((story, index) => (
            <div
              key={index}
              className="relative p-10 rounded-md bg-gray-50 border border-gray-100 hover:bg-blue-50 transition-all duration-500 group"
            >
              <IconQuote
                size={48}
                className="absolute top-8 right-10 text-blue-100 group-hover:text-blue-200 transition-colors"
              />

              <div className="relative z-10">
                <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                  "{story.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-md overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{story.name}</h4>
                    <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-tighter">
                      <IconBriefcase size={14} />
                      {story.outcome}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">
                    {story.edition}
                  </span>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <IconBrandLinkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 bg-gray-900 rounded-md text-center px-10">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white mb-2">
              2k+
            </p>
            <p className="text-blue-400 text-xs font-semibold uppercase">
              Students Trained
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white mb-2">
              85%
            </p>
            <p className="text-blue-400 text-xs font-semibold uppercase">
              Job Placement
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white mb-2">
              500+
            </p>
            <p className="text-blue-400 text-xs font-semibold uppercase">
              Startups Born
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-white mb-2">
              ₦0.00
            </p>
            <p className="text-blue-400 text-xs font-semibold uppercase">
              Free Tracks Available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
