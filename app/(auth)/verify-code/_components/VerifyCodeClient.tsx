"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Loader } from "@/components/Loader";

type VerifyCodeInput = {
  email: string;
  otp: string;
};

const RESEND_SECONDS = 60;

const VerifyCodeContent = () => {
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
        `/set-new-password?email=${encodeURIComponent(values.email)}&otp=${encodeURIComponent(values.otp)}`,
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
    <div className="min-h-screen flex items-center justify-center py-10 container">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-center">
          <Logo />
        </div>

        {/* Card */}
        <Card className="mt-10">
          <CardHeader className="text-center border-b">
            <CardTitle>Verify Identity</CardTitle>
            <CardDescription>
              We&apos;ve sent a 6-digit code to{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                {maskEmail(email)}
              </span>
              . Enter it below to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                                className="w-12 h-14 md:w-14 md:h-16 text-xl rounded-md border-2 first:rounded-md last:rounded-md first:border-l-2"
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
                  className="w-full"
                >
                  {isSubmitting ? (
                    <Loader text="Verifying..." />
                  ) : (
                    "Verify & Proceed"
                  )}
                </Button>
              </form>
            </Form>

            {/* Resend */}
            <div className="mt-6 pt-8 border-t border-gray-100 flex items-center justify-start gap-1 dark:border-gray-800">
              <p className="text-gray-400 text-sm">Didn&apos;t get the code?</p>
              <Button
                variant="link"
                type="button"
                onClick={handleResend}
                disabled={!canResend || isResending}
              >
                {isResending ? (
                  <Loader text="Resending..." />
                ) : (
                  <>
                    <IconRefresh />{" "}
                    {canResend
                      ? "Resend Code"
                      : `Resend Code (${formatTime(countdown)})`}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
          <IconDeviceMobileCheck size={16} />
          <span className="text-xs font-medium">
            Secure Verification by School of Innovation
          </span>
        </div>
      </div>
    </div>
  );
};

const VerifyCodePage = () => (
  <Suspense>
    <VerifyCodeContent />
  </Suspense>
);

export default VerifyCodePage;
