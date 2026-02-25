"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconKey,
  IconMail,
  IconArrowLeft,
  IconCircleCheck,
  IconLifebuoy,
  IconLoader2,
} from "@tabler/icons-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordFormSchema } from "@/lib/zodSchemas";
import { postData } from "@/lib/api";

type ForgotPasswordInput = {
  email: string;
};

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(forgotPasswordFormSchema as any),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    try {
      await postData("/auth/forgot-password", values);
      setSubmittedEmail(values.email);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Something went wrong. Please try again.";
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;
    try {
      await postData("/auth/forgot-password", { email: submittedEmail });
      toast.success("Reset code resent!");
    } catch {
      toast.error("Failed to resend. Please try again.");
    }
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    return `${local[0]}***@${domain}`;
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back link */}
        <div className="text-center mb-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
          >
            <IconArrowLeft size={18} />
            Back to Login
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 rounded-t-[2.5rem]" />

          {!submittedEmail ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <IconKey size={40} />
              </div>

              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                Forgot Password?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
                No worries! Enter the email associated with your account and we&apos;ll send you a reset code.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              className="pl-10 py-5 rounded-xl"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gray-900 hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-600 dark:hover:text-white text-white rounded-2xl font-black text-base shadow-xl gap-2 transition-all"
                  >
                    {isSubmitting ? (
                      <IconLoader2 size={20} className="animate-spin" />
                    ) : (
                      "Send Reset Code"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          ) : (
            /* Success state */
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 dark:bg-green-950 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <IconCircleCheck size={40} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                Check your Email
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                We&apos;ve sent a 6-digit reset code to{" "}
                <span className="text-gray-900 dark:text-white font-bold">
                  {maskEmail(submittedEmail)}
                </span>
                . Check your inbox and spam folder.
              </p>
              <Button
                onClick={() => router.push(`/verify-code?email=${encodeURIComponent(submittedEmail)}`)}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black mb-4"
              >
                Enter the Code
              </Button>
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-blue-600 font-bold hover:underline"
              >
                Didn&apos;t receive it? Resend Code
              </button>
            </div>
          )}
        </div>

        {/* Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <IconLifebuoy size={18} />
            Need help?{" "}
            <Link href="/contact" className="text-gray-900 dark:text-white font-bold hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
