"use client";

import { useRef } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import type { FlutterWaveResponse } from "flutterwave-react-v3/dist/types";
import { postData } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { NairaIcon } from "./NairaIcon";

/**
 * What is being bought. Decides the tx_ref prefix and the `meta` key, both of
 * which the backend uses to bind the transaction to this exact product — see
 * PaymentsService.verifyAndCapture.
 */
export type ProductKind = "course" | "live-session";

const REF_PREFIX: Record<ProductKind, string> = {
  course: "course",
  "live-session": "live",
};

const META_KEY: Record<ProductKind, string> = {
  course: "courseId",
  "live-session": "liveSessionId",
};

const VERIFY_PATH: Record<ProductKind, (id: string) => string> = {
  course: (id) => `/enrollments/${id}/verify-payment`,
  "live-session": (id) => `/live/${id}/verify-payment`,
};

interface Props {
  productKind?: ProductKind;
  courseId: string;
  courseTitle: string;
  price: number;
  currency: string;
  couponCode?: string;
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
  productKind = "course",
  courseId,
  courseTitle,
  price,
  currency,
  couponCode,
  user,
  onSuccess,
  disabled,
  className,
}: Props) {
  const verifying = useRef(false);

  // Prefixed with the product id so the backend can bind the transaction even
  // if `meta` does not come back on the verify response.
  const txRef = `${REF_PREFIX[productKind]}-${courseId}-${Date.now()}`;

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
    meta: { [META_KEY[productKind]]: courseId },
  };

  const handleFlutterPayment = useFlutterwave(config);

  async function handleCallback(response: FlutterWaveResponse) {
    closePaymentModal();

    // Don't gate on response.status here — the inline modal returns
    // "successful" in test mode but "completed" (and other strings) in live.
    // The only reliable signal is that we got a transaction_id back; the
    // backend re-verifies the real status with Flutterwave's verify API.
    if (!response.transaction_id) {
      toast.error("Payment was not completed. Please try again.");
      return;
    }

    if (verifying.current) return;
    verifying.current = true;

    const loadingToast = toast.loading("Confirming your payment…");
    try {
      await postData(VERIFY_PATH[productKind](courseId), {
        transactionId: String(response.transaction_id),
        txRef: response.tx_ref,
        ...(couponCode && { couponCode }),
      });
      toast.dismiss(loadingToast);
      toast.success("Payment confirmed! You are now enrolled. 🎉");
      onSuccess();
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const msg = err?.response?.data?.message;
      if (msg === "Already enrolled" || msg === "You are already registered") {
        // Edge case: payment went through but access already existed
        toast.success(
          productKind === "course"
            ? "You are already enrolled in this course."
            : "You are already registered for this class.",
        );
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
