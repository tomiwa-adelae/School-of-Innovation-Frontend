"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconShieldLock,
  IconArrowLeft,
  IconRefresh,
  IconDeviceMobileCheck,
  IconLoader2,
} from "@tabler/icons-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { VerifyCodeSchema } from "@/lib/zodSchemas";
import { postData } from "@/lib/api";

type VerifyCodeInput = {
  email: string;
  otp: string;
};

const RESEND_SECONDS = 60;

const VerifyCodePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<VerifyCodeInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(VerifyCodeSchema as any),
    defaultValues: { email, otp: "" },
  });

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleResend = useCallback(async () => {
    if (!canResend || !email) return;
    setIsResending(true);
    try {
      await postData("/auth/forgot-password", { email });
      toast.success("A new code has been sent!");
      setCountdown(RESEND_SECONDS);
      setCanResend(false);
      form.setValue("otp", "");
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  }, [canResend, email, form]);

  const onSubmit = async (values: VerifyCodeInput) => {
    try {
      await postData("/auth/verify-code", values);
      toast.success("Identity verified!");
      router.push(
        `/set-new-password?email=${encodeURIComponent(values.email)}&otp=${encodeURIComponent(values.otp)}`
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Invalid or expired code.";
      toast.error(Array.isArray(message) ? message[0] : message);
      form.setValue("otp", "");
    }
  };

  const maskEmail = (e: string) => {
    if (!e) return "your email";
    const [local, domain] = e.split("@");
    return `${local[0]}***@${domain}`;
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back link */}
        <div className="text-center mb-10">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
          >
            <IconArrowLeft size={18} />
            Back to Forgot Password
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-800 text-center">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <IconShieldLock size={40} />
          </div>

          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
            Verify Identity
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="text-gray-900 dark:text-white font-bold">{maskEmail(email)}</span>.
            Enter it below to reset your password.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup className="gap-3">
                          {[0, 1, 2, 3, 4, 5].map((i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              className="w-12 h-14 md:w-14 md:h-16 text-xl font-black rounded-2xl border-2 first:rounded-2xl last:rounded-2xl first:border-l-2"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gray-900 hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-600 dark:hover:text-white text-white rounded-2xl font-black text-base shadow-xl transition-all gap-2"
              >
                {isSubmitting ? (
                  <IconLoader2 size={20} className="animate-spin" />
                ) : (
                  "Verify & Proceed"
                )}
              </Button>
            </form>
          </Form>

          {/* Resend */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-400 text-sm mb-4">Didn&apos;t get the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="flex items-center gap-2 mx-auto font-black transition-colors disabled:text-gray-300 dark:disabled:text-gray-600 text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <IconLoader2 size={18} className="animate-spin" />
              ) : (
                <IconRefresh size={18} />
              )}
              {canResend ? "Resend Code" : `Resend Code (${formatTime(countdown)})`}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <IconDeviceMobileCheck size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Secure Verification by Innovation 4.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;
