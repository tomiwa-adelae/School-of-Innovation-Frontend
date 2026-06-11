import React from "react";
import {
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
  IconPhone,
  IconMapPin,
  IconArrowUpRight,
} from "@tabler/icons-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="text-2xl font-bold uppercase text-white">
              School of <span className="text-blue-500">Innovation</span>
            </div>
            <p className="text-sm leading-relaxed">
              Empowering Africa's next generation of founders, creators, and
              tech leaders through high-impact events and digital education.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-white/5 rounded-md hover:bg-blue-600 hover:text-white transition-all"
              >
                <IconBrandLinkedin size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 rounded-md hover:bg-blue-400 hover:text-white transition-all"
              >
                <IconBrandTwitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-white/5 rounded-md hover:bg-pink-600 hover:text-white transition-all"
              >
                <IconBrandInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links: Event */}
          <div className="hidden">
            <h4 className="text-white font-bold mb-6">The Conference</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#speakers" className="hover:text-primary transition">
                  Speakers 2026
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-primary transition">
                  Event Roadmap
                </a>
              </li>
              <li>
                <a href="#tickets" className="hover:text-primary transition">
                  Get Your Tickets
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-primary transition">
                  Past Editions
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links: LMS */}
          <div>
            <h4 className="text-white font-bold mb-6">School of Innovation</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  Web Development <IconArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  Digital Marketing <IconArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  Arduino Programming <IconArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  LMS Login
                </a>
              </li>
              <li>
                <a
                  href="/verify"
                  className="flex items-center gap-1 hover:text-orange-500 transition"
                >
                  Verify Certificate
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <a
                href={`mailto:admin@innovationconference.com.ng`}
                className="flex items-center gap-3"
              >
                <IconMail size={18} className="text-blue-500" />
                admin@innovationconference.com.ng
              </a>
              <a
                href={`tel:+2348101569177`}
                className="flex items-center gap-3"
              >
                <IconPhone size={18} className="text-blue-500" />
                +234 810 156 9177
              </a>
              <li className="flex items-center gap-3">
                <IconMapPin size={18} className="text-blue-500" />
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase font-medium">
          <p>
            © {currentYear} School of Innovation. Powered by Cornerstone Intl.
          </p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/2348101569177"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <IconBrandWhatsapp size={28} />
      </a>
    </footer>
  );
};
