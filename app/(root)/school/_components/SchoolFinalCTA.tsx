import React from "react";
import {
  IconPlus,
  IconArrowRight,
  IconQuestionMark,
  IconMail,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const SchoolFinalCTA = () => {
  const faqs = [
    {
      q: "Do I need a high-end laptop to start?",
      a: "No. Most of our tracks, including Digital Marketing and Web Dev, can be started with a basic laptop. For Robotics/IoT, we provide a hardware list that fits various budgets.",
    },
    {
      q: "How much data will I need for the videos?",
      a: "We’ve optimized our LMS for the African context. Videos are compressed for low-data usage, and many resources are available as downloadable PDFs.",
    },
    {
      q: "Are the certificates recognized by employers?",
      a: "Yes. Our certificates are issued by Cornerstone International Foundation and are verifiable via a unique ID on our platform, making them a strong addition to your LinkedIn.",
    },
    {
      q: "What happens if I get stuck during a lesson?",
      a: "Every track has a dedicated Discord/Telegram community where mentors and fellow students provide support within 24 hours.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Left: FAQ Heading */}
          <div>
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-6">
              <IconQuestionMark size={24} />
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-6">
              Everything you need <br className="hidden lg:block" /> to know.
            </h3>
            <p className="text-gray-600 mb-8">
              Still have questions? Our team is here to help you choose the
              right path for your career goals.
            </p>
            <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
              <IconMail size={20} />
              Contact Admissions Support <IconArrowRight size={18} />
            </button>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-900">{faq.q}</h4>
                  <IconPlus
                    size={20}
                    className="text-primary group-hover:rotate-45 transition-transform"
                  />
                </div>
                <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Enrollment Banner */}
        <div className="relative bg-gray-900 rounded-md p-10 md:p-20 text-center overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#2563eb,transparent_50%)] opacity-20" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,#f97316,transparent_50%)] opacity-10" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your future is{" "}
              <span className="text-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                waiting to be built.
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join 2,000+ students already mastering the skills of tomorrow.
              Limited free scholarships available for 2026.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button>Enroll for Free Today</Button>
              <Button variant={"secondary"}>View All Tracks</Button>
            </div>
            <p className="mt-8 text-gray-500 text-sm">
              No credit card required for free tracks. Start learning in 2
              minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
