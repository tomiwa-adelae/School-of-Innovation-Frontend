import type { Metadata } from "next";
import SetNewPasswordClient from "./_components/SetNewPasswordClient";

export const metadata: Metadata = {
  title: "Set New Password",
  description:
    "Create a new secure password for your School of Innovation account.",
  robots: { index: false, follow: false },
};

export default function SetNewPasswordPage() {
  return <SetNewPasswordClient />;
}
