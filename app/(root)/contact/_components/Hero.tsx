import React from "react";
import {
  IconMessageDots,
  IconPhoneCall,
  IconMapPin,
  IconArrowRight,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-60" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold mb-6">
              <IconMessageDots size={16} />
              <span>WE'RE ALWAYS LISTENING</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Got an Idea? <br className="hidden lg:block" />
              <span className="text-primary">Let’s Talk.</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Whether you're looking to partner, have questions about the School
              of Innovation, or want to volunteer for the next conference, we're
              one message away.
            </p>

            {/* Quick Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                  <IconPhoneCall size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                    Call Us
                  </p>
                  <p className="text-gray-900 font-bold">+234 810 156 9177</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-md hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                  <IconMapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                    Visit Us
                  </p>
                  <p className="text-gray-900 font-bold">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Visual Element or Floating Form Preview */}
          <div className="relative">
            <div className="bg-gray-900 rounded-md p-8 md:p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />

              <h3 className="text-2xl font-bold text-white mb-2">
                Send a Message
              </h3>
              <p className="text-gray-400 text-sm mb-8">
                Expect a response within 24 hours.
              </p>

              <form className="space-y-4">
                <Input type="text" placeholder="Full Name" />
                <Input type="email" placeholder="Email Address" />
                <Textarea rows={4} placeholder="How can we help?" />

                <Button className="w-full">
                  Send Message <IconArrowRight />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
