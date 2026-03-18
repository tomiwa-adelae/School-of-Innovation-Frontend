"use client";
import React, { useState } from "react";
import {
  IconPlus,
  IconMinus,
  IconMail,
  IconSend,
  IconMessageCircle,
} from "@tabler/icons-react";

export const ClarityHub = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      q: "Is Innovation 4.0 free to attend?",
      a: "We offer both Free and Paid tiers. The Digital Pass is free for online workshops, while the Physical Delegate and Founder passes have a fee to cover venue, logistics, and exclusive resources.",
    },
    {
      q: "How do I access my LMS courses after purchase?",
      a: "Once you purchase a course from the School of Innovation, it's immediately added to your 'My Learning' dashboard. You can watch the lessons, take quizzes, and download certificates anytime, anywhere.",
    },
    {
      q: "Can I attend virtually if I am not in Lagos?",
      a: "Yes! Our Digital Pass allows you to stream keynote sessions and participate in specific virtual tracks designed for our global audience.",
    },
    {
      q: "Are the certifications recognized?",
      a: "Our certifications are issued by the School of Innovation and backed by Cornerstone International Foundation, designed to validate the specific tech and entrepreneurial skills demanded by today's employers.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* FAQ Accordion */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Got Questions? <br className="hidden lg:block" />
              <span className="text-blue-600">We've Got Answers.</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100">
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full flex justify-between items-center py-4 text-left hover:text-blue-600 transition-colors"
                  >
                    <span className="text-base font-medium text-gray-800">
                      {faq.q}
                    </span>
                    {openIndex === index ? (
                      <IconMinus size={20} />
                    ) : (
                      <IconPlus size={20} />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-40 pb-6" : "max-h-0"}`}
                  >
                    <p className="text-gray-600 text-base leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter / Community Capture */}
          <div className="bg-primary rounded-md p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
            {/* Decorative Icon */}
            <IconMessageCircle
              size={120}
              className="absolute -bottom-10 -right-10 opacity-10 rotate-12"
            />

            <h3 className="text-3xl font-bold mb-4">Stay in the Loop</h3>
            <p className="text-blue-100 mb-8 text-lg">
              Get notified about Innovation 5.0, new course drops, and exclusive
              scholarship opportunities. No spam, just impact.
            </p>

            <form className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/20 rounded-md py-4 px-6 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-white text-blue-600 px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition">
                <span className="hidden sm:inline">Subscribe</span>
                <IconSend size={18} />
              </button>
            </form>

            <p className="mt-6 text-sm text-blue-200 text-center">
              Join 10,000+ innovators already on the list.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
