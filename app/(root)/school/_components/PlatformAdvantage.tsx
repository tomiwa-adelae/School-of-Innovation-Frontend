import React from "react";
import {
  IconDeviceMobile,
  IconInfinity,
  IconUsersGroup,
  IconMessageCode,
  IconRocket,
  IconCertificate,
} from "@tabler/icons-react";

export const PlatformAdvantage = () => {
  const features = [
    {
      title: "Mentor-Led Support",
      desc: "Don't get stuck. Access our private Discord and Telegram channels for direct help from industry experts.",
      icon: <IconMessageCode size={30} />,
      color: "bg-blue-600",
    },
    {
      title: "Project-Based Learning",
      desc: "Stop passive watching. Build real-world startups, apps, and hardware as part of your final assessment.",
      icon: <IconRocket size={30} />,
      color: "bg-orange-600",
    },
    {
      title: "Lifetime Access",
      desc: "Enroll once, learn forever. Get free updates to course content as technology and industry standards evolve.",
      icon: <IconInfinity size={30} />,
      color: "bg-purple-600",
    },
    {
      title: "Mobile-First Learning",
      desc: "Learn on the go. Our platform is optimized for low-data usage and mobile-friendly video streaming.",
      icon: <IconDeviceMobile size={30} />,
      color: "bg-green-600",
    },
    {
      title: "Active Community",
      desc: "Network with thousands of fellow African visionaries. Find your future co-founder within our student body.",
      icon: <IconUsersGroup size={30} />,
      color: "bg-indigo-600",
    },
    {
      title: "Verified Credentials",
      desc: "Every track ends with a professional certificate verified by the Cornerstone International Foundation.",
      icon: <IconCertificate size={30} />,
      color: "bg-red-600",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-950 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <h2 className="text-blue-400 font-semibold uppercase text-xs mb-4">
            Why Innovation 5.0?
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            Built for the <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              African Tech Context.
            </span>
          </h3>
          <p className="text-gray-400 text-lg">
            We’ve removed the barriers to entry. High-quality instruction,
            low-data costs, and a support system that actually cares about your
            success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 ${f.color} rounded-md flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}
              >
                {f.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{f.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Bar */}
        <div className="mt-10 py-5 border-t border-white/10 flex flex-wrap justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
          <p className="text-xs font-semibold uppercase">In Partnership With</p>
          {/* Add your partner logos here */}
          <div className="flex gap-8 items-center italic font-serif text-base">
            <span>Cornerstone Intl.</span>
            <span>School of Innovation</span>
            <span>TechAfrica Alliance</span>
          </div>
        </div>
      </div>
    </section>
  );
};
