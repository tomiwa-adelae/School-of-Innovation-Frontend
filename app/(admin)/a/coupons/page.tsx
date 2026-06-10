import type { Metadata } from "next";
import AdminCouponsClient from "./_components/AdminCouponsClient";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Create and manage discount coupons for paid courses.",
  robots: { index: false, follow: false },
};

export default function AdminCouponsPage() {
  return <AdminCouponsClient />;
}
