"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconLockCheck,
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconX,
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
import { NewPasswordSchema } from "@/lib/zodSchemas";
import { postData } from "@/lib/api";

type NewPasswordInput = {
  otp: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
};

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const SetNewPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const otp = searchParams.get("otp") ?? "";

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<NewPasswordInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(NewPasswordSchema as any),
    defaultValues: {
      otp,
      email,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");

  const passedCount = requirements.filter((r) => r.test(newPassword)).length;
  const strengthColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

  const onSubmit = async (values: NewPasswordInput) => {
    try {
      await postData("/auth/set-new-password", values);
      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Failed to update password. Please try again.";
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  const { isSubmitting } = form.formState;

  // Guard: if no email or otp in URL, the link is invalid
  if (!email || !otp) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-950 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <IconX size={40} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Invalid Link</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            This password reset link is invalid or expired. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 rounded-t-[2.5rem]" />

          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <IconLockCheck size={40} />
          </div>

          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 text-center">
            Set New Password
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-center leading-relaxed">
            Almost there! Choose a strong password to protect your account.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNew ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10 py-5 rounded-xl"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          {showNew ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    {/* Strength meter */}
                    {newPassword.length > 0 && (
                      <div className="flex gap-1 h-1.5 mt-2">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-colors duration-300 ${
                              i < passedCount ? strengthColors[passedCount - 1] : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10 py-5 rounded-xl"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requirements checklist */}
              <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-2.5">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Security Requirements
                </p>
                {requirements.map(({ label, test }) => {
                  const passed = newPassword.length > 0 && test(newPassword);
                  return (
                    <div
                      key={label}
                      className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                        passed ? "text-green-600 dark:text-green-400" : "text-gray-400"
                      }`}
                    >
                      {passed ? <IconCheck size={14} /> : <IconX size={14} />}
                      {label}
                    </div>
                  );
                })}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gray-900 hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-600 dark:hover:text-white text-white rounded-2xl font-black text-base shadow-xl transition-all gap-2"
              >
                {isSubmitting ? (
                  <IconLoader2 size={20} className="animate-spin" />
                ) : (
                  <>Update Password <IconArrowRight size={20} /></>
                )}
              </Button>
            </form>
          </Form>
        </div>

        <p className="mt-8 text-center text-gray-400 dark:text-gray-500 text-sm">
          Securing your account for{" "}
          <span className="text-gray-900 dark:text-white font-bold">Innovation 4.0</span>
        </p>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
