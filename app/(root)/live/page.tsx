import type { Metadata } from "next";
import LiveIndexClient from "./_components/LiveIndexClient";

export const metadata: Metadata = {
  title: "Live Classes | School of Innovation",
  description:
    "Join live, interactive classes taught by expert instructors. Reserve your seat for upcoming sessions on tech, design, business and more.",
  openGraph: {
    title: "Live Classes | School of Innovation",
    description:
      "Live, interactive classes with expert instructors. Reserve your seat.",
    url: "https://innovationconference.com.ng/live",
  },
  alternates: { canonical: "https://innovationconference.com.ng/live" },
};

export default function LivePage() {
  return <LiveIndexClient />;
}
