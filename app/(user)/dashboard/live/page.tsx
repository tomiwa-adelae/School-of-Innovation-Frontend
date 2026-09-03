import type { Metadata } from "next";
import MyLiveClient from "./_components/MyLiveClient";

export const metadata: Metadata = {
  title: "Live Classes",
  description: "Your upcoming and past live classes at School of Innovation.",
  robots: { index: false, follow: false },
};

export default function MyLivePage() {
  return <MyLiveClient />;
}
