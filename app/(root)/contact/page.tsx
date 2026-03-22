import type { Metadata } from "next";
import React from "react";
import { Hero } from "./_components/Hero";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the School of Innovation team. Reach us for course enquiries, partnerships, technical support, or general questions. We are here to help.",
  keywords: [
    "contact School of Innovation",
    "support",
    "course enquiries",
    "partnership",
    "reach us",
  ],
  openGraph: {
    title: "Contact Us | School of Innovation",
    description:
      "Reach the School of Innovation team for course enquiries, partnerships, or support. We are happy to help.",
    url: "https://innovationconference.com.ng/contact",
  },
  alternates: { canonical: "https://innovationconference.com.ng/contact" },
};
import { ContactChannels } from "./_components/ContactChannels";
import { SocialEcosystem } from "./_components/SocialEcosystem";

const page = () => {
  return (
    <div>
      <Hero />
      <ContactChannels />
      <SocialEcosystem />
    </div>
  );
};

export default page;
