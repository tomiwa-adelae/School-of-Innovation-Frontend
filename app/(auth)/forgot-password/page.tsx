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
import { Logo } from "@/components/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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
      router.push(`/verify-code?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Something went wrong. Please try again.";
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
    <div className="min-h-screen flex items-center justify-center py-10 container">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-center">
          <Logo />
        </div>

        {/* Card */}
        <Card className="mt-10">
          <CardHeader className="text-center border-b">
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              No worries! Enter the email associated with your account and
              we&apos;ll send you a reset code.
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 text-left"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="name@example.com"
                          />
                          <InputGroupAddon>
                            <IconMail />
                          </InputGroupAddon>
                        </InputGroup>
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
                    <IconLoader2 size={20} className="animate-spin" />
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <IconLifebuoy size={18} />
            Need help?{" "}
            <Link
              href="/contact"
              className="text-gray-900 dark:text-white font-bold hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
