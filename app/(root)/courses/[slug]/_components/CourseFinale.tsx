import React from "react";
import {
  IconPlus,
  IconArrowRight,
  IconChecks,
  IconShieldCheck,
  IconMessageDots,
} from "@tabler/icons-react";

export const CourseFinale = () => {
  const courseFaqs = [
    {
      q: "What are the prerequisites for the MERN track?",
      a: "You should have a basic understanding of HTML, CSS, and fundamental JavaScript (variables, loops, and functions). We provide a 'Pre-Flight' module for those who need a quick refresher.",
    },
    {
      q: "Will I get a certificate after completing the MERN track?",
      a: "Yes. Upon successful submission of your Fintech Capstone project and passing the final assessment, you will receive a verified certificate from the School of Innovation.",
    },
    {
      q: "What if I miss a live mentorship session?",
      a: "All live sessions are recorded and uploaded to the student dashboard within 24 hours, so you can rewatch them at your own pace.",
    },
    {
      q: "Is the project I build mine to keep?",
      a: "Absolutely. We help you push your code to your own GitHub profile and deploy it to a live URL so you can use it in your professional portfolio.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        {/* Specific FAQ */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3">
              Questions about MERN
            </h2>
            <h3 className="text-3xl font-black text-gray-900">
              Specifics <span className="text-gray-400">& Logistics.</span>
            </h3>
          </div>

          <div className="space-y-4">
            {courseFaqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-900">{faq.q}</h4>
                  <IconPlus
                    size={20}
                    className="text-blue-600 group-hover:rotate-45 transition-transform"
                  />
                </div>
                <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The "Closing" Banner */}
        <div className="relative bg-blue-600 rounded-[3rem] p-10 md:p-20 text-white overflow-hidden shadow-2xl shadow-blue-900/40">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-[80px] -ml-32 -mb-32" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Ready to become a <br />
                <span className="text-blue-200">Full-Stack Engineer?</span>
              </h2>
              <p className="text-blue-50 text-lg mb-8 opacity-90">
                Join 1,200+ students currently mastering the MERN stack. Start
                building production-grade apps today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                  Enroll for Free Now <IconArrowRight size={20} />
                </button>
                <button className="bg-blue-700 text-white border border-blue-500 px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
                  <IconMessageDots size={20} /> Chat with a Mentor
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <IconShieldCheck size={24} className="text-blue-300" />
                The Innovation Guarantee
              </h4>
              <ul className="space-y-4">
                {[
                  "Verified Professional Certificate",
                  "Lifetime Access to Course Updates",
                  "Access to our Recruitment Network",
                  "Direct Mentorship from Tech Leads",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <IconChecks size={20} className="text-blue-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
