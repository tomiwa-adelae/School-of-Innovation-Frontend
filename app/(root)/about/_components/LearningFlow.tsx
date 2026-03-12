import React from "react";
import {
  IconShoppingCart,
  IconPlayerPlay,
  IconTrophy,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const LearningFlow = () => {
  const steps = [
    {
      id: "01",
      title: "Enroll & Access",
      desc: "Pick your track and gain instant access to our high-definition curriculum and downloadable resources.",
      icon: <IconShoppingCart size={28} />,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
    },
    {
      id: "02",
      title: "Learn & Build",
      desc: "Watch expert-led videos and complete hands-on projects designed to simulate real-world startup challenges.",
      icon: <IconPlayerPlay size={28} />,
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
    },
    {
      id: "03",
      title: "Get Certified",
      desc: "Pass your assessments and receive a verified certificate from the School of Innovation to boost your career.",
      icon: <IconTrophy size={28} />,
      color: "bg-green-600",
      lightColor: "bg-green-50",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-primary font-semibold uppercase text-sm mb-2">
            The Student Journey
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            How You'll <span className="text-gray-400">Master Innovation.</span>
          </h3>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-8 items-start">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-gray-200 z-0" />

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex-1 group">
              {/* Number Badge */}
              <div className="mb-8 flex items-center justify-center lg:justify-start">
                <span
                  className={`w-12 h-12 rounded-full ${step.color} text-white flex items-center justify-center font-black text-lg shadow-xl shadow-gray-200 group-hover:scale-110 transition-transform`}
                >
                  {step.id}
                </span>
              </div>

              {/* Card */}
              <div className="bg-white p-10 rounded-md border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full">
                <div
                  className={`w-16 h-16 ${step.lightColor} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <div className={step.color.replace("bg-", "text-")}>
                    {step.icon}
                  </div>
                </div>

                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h4>
                <p className="text-gray-500 leading-relaxed mb-8">
                  {step.desc}
                </p>

                {/* Subtle Detail */}
                <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-widest">
                  <span>Innovation 4.0 Standard</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 flex flex-col items-center">
          <p className="text-gray-500 mb-6 font-medium">
            Ready to start your first lesson?
          </p>
          <Button>
            Browse the Course Library
            <IconArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
};
