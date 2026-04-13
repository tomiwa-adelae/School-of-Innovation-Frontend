"use client";

import { useRef } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import type { FlutterWaveResponse } from "flutterwave-react-v3/dist/types";
import { postData } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IconLoader2, IconCurrencyDollar } from "@tabler/icons-react";
import { env } from "@/lib/env";
import { NairaIcon } from "./NairaIcon";

interface Props {
  courseId: string;
  courseTitle: string;
  price: number;
  currency: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
  };
  onSuccess: () => void; // called when enrollment is confirmed
  disabled?: boolean;
  className?: string;
}

export function FlutterwavePayButton({
  courseId,
  courseTitle,
  price,
  currency,
  user,
  onSuccess,
  disabled,
  className,
}: Props) {
  const verifying = useRef(false);

  // Build a unique tx_ref for this attempt
  const txRef = `course-${courseId}-${Date.now()}`;

  const config = {
    public_key: env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: txRef,
    amount: price,
    currency: currency || "NGN",
    payment_options: "card,ussd,banktransfer",
    customer: {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      phone_number: user.phoneNumber ?? "",
    },
    customizations: {
      title: "School of Innovation",
      description: `Payment for: ${courseTitle}`,
      logo: "", // fill with your logo URL if desired
    },
    meta: { courseId },
  };

  const handleFlutterPayment = useFlutterwave(config);

  async function handleCallback(response: FlutterWaveResponse) {
    closePaymentModal();

    if (response.status !== "successful") {
      toast.error("Payment was not completed. Please try again.");
      return;
    }

    if (verifying.current) return;
    verifying.current = true;

    const loadingToast = toast.loading("Confirming your payment…");
    try {
      await postData(`/enrollments/${courseId}/verify-payment`, {
        transactionId: String(response.transaction_id),
        txRef: response.tx_ref,
      });
      toast.dismiss(loadingToast);
      toast.success("Payment confirmed! You are now enrolled. 🎉");
      onSuccess();
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const msg = err?.response?.data?.message;
      if (msg === "Already enrolled") {
        // Edge case: payment went through but enrollment already existed
        toast.success("You are already enrolled in this course.");
        onSuccess();
      } else {
        toast.error(
          msg ??
            "Payment received but enrollment failed. Please contact support.",
        );
      }
    } finally {
      verifying.current = false;
    }
  }

  return (
    <Button
      className={className}
      disabled={disabled}
      onClick={() =>
        handleFlutterPayment({
          callback: handleCallback,
          onClose: () => {},
        })
      }
    >
      <NairaIcon />
      Buy Now — {currency || "NGN"} {price?.toLocaleString()}
    </Button>
  );
}
