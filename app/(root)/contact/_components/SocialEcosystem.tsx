import React from "react";
import {
  IconBrandWhatsapp,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconUsers,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const SocialEcosystem = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="bg-blue-600 rounded-md p-8 md:p-16 text-white relative overflow-hidden">
          {/* Decorative Background Icon */}
          <IconUsers
            size={300}
            className="absolute -bottom-20 -right-20 opacity-10 rotate-12"
          />

          <div className="grid lg:grid-cols-2 gap-6 items-center relative z-10">
            <div>
              <h2 className="text-md md:text-4xl font-bold mb-6">
                Don't just contact us. <br className="hidden lg:block" />
                <span className="text-blue-200">Join the movement.</span>
              </h2>
              <p className="text-blue-100 text-base mb-6 leading-relaxed">
                Our inbox is for business, but our community is for growth. Get
                real-time updates, network with fellow founders, and never miss
                a scholarship opportunity.
              </p>

              <div className="flex flex-wrap gap-4">
                {/* Primary Community: WhatsApp */}
                <Button asChild variant="white">
                  <a href="https://wa.me/2348101569177" target="_blank">
                    <IconBrandWhatsapp />
                    Join WhatsApp Community
                  </a>
                </Button>

                {/* Secondary: LinkedIn */}
                <Button asChild>
                  <a href="#">
                    <IconBrandLinkedin />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>

            {/* Social Grid Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-md border border-white/10">
                <IconBrandTwitter size={32} className="mb-4 text-blue-200" />
                <p className="text-2xl font-black">12K+</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-60">
                  Followers
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-md border border-white/10">
                <IconBrandYoutube size={32} className="mb-4 text-red-400" />
                <p className="text-2xl font-black">500+</p>
                <p className="text-xs uppercase tracking-widest font-bold opacity-60">
                  Hours of Content
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-md border border-white/10 col-span-2 flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">Member Spotlight</p>
                  <p className="text-sm opacity-60">
                    New founders joining every hour
                  </p>
                </div>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-blue-600 bg-gray-300 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="user"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Tagline */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 font-medium flex items-center justify-center gap-2">
            Innovation 5.0 is powered by the people.{" "}
            <IconArrowUpRight size={16} />
          </p>
        </div>
      </div>
    </section>
  );
};
