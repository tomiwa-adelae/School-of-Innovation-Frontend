import React from "react";
import { IconArrowRight, IconMicrophone2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] py-16 w-full flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Video/Image Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black z-10" />
        {/* Replace the src with your actual video or a high-res tech stock photo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
          poster="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80"
        >
          <source
            src="https://res.cloudinary.com/dh0rc6p1c/video/upload/v1744459054/innovation/speakers/INNOVATION_4.0_1_ym7cqb.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Content */}
      <div className="container relative z-20 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
          Unlocking the <br />{" "}
          <span className="text-blue-500">Power of You</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
          The ultimate launchpad for Africa’s next generation of founders. Join
          2,000+ visionaries for Innovation 5.0.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/register`} className="flex items-center gap-2">
              Register Now
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-blue-500 to-transparent" />
      </div>
    </section>
  );
};
