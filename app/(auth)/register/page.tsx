"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconUser,
  IconMail,
  IconLock,
  IconSchool,
  IconArrowRight,
  IconDeviceLaptop,
  IconEye,
  IconEyeOff,
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
import { Checkbox } from "@/components/ui/checkbox";
import { RegisterFormSchema } from "@/lib/zodSchemas";
import { postData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";

// acceptTerms starts as boolean in the form; schema validates it becomes true
type RegisterFormInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const RegisterPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<RegisterFormInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(RegisterFormSchema as any),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = form.watch("password");

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
    return score;
  };

  const score = getStrength(password);
  const strengthColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"];

  const onSubmit = async (values: RegisterFormInput) => {
    try {
      const data = await postData<{ user: any }>("/auth/register", values);
      setUser(data.user);
      toast.success("Account created! Let's set up your profile.");
      router.push("/onboarding");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Registration failed. Please try again.";
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-center p-20 text-white">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-5xl font-black leading-tight mb-12">
            Start your <br />
            <span className="text-blue-200">Innovation Journey.</span>
          </h2>

          <div className="space-y-10">
            {[
              { title: "Create your Profile", desc: "Join 2,000+ African visionaries.", icon: <IconUser /> },
              { title: "Choose your Track", desc: "Select from 50+ specialized courses.", icon: <IconSchool /> },
              { title: "Start Building", desc: "Access labs and mentorship immediately.", icon: <IconDeviceLaptop /> },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-blue-600 transition-all duration-300">
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">{step.title}</h4>
                  <p className="text-blue-100 opacity-80">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[11, 12, 13, 14].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i}`}
                    className="w-10 h-10 rounded-full border-2 border-blue-600"
                    alt="student"
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-blue-100">
                Joined by 40+ students today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-md">
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Create Account
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Join the School of Innovation community.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <Input placeholder="John" className="pl-9 py-5 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" className="py-5 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
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
                          placeholder="john@example.com"
                          className="pl-10 py-5 rounded-xl"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10 py-5 rounded-xl"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    {password.length > 0 && (
                      <div className="space-y-1 mt-1">
                        <div className="flex gap-1 h-1.5">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-colors duration-300 ${
                                i < score ? strengthColors[score - 1] : "bg-gray-200 dark:bg-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Strength:{" "}
                          <span className={`font-bold ${
                            score <= 1 ? "text-red-500" : score === 2 ? "text-orange-400" : score === 3 ? "text-yellow-500" : "text-green-500"
                          }`}>
                            {score > 0 ? strengthLabel[score - 1] : "—"}
                          </span>
                        </p>
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
                    <FormLabel className="font-bold">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="Repeat your password"
                          className="pl-10 pr-10 py-5 rounded-xl"
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

              {/* Terms */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 py-1 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 font-bold underline">Terms of Service</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-blue-600 font-bold underline">Privacy Policy</Link>.
                      </p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base shadow-xl shadow-blue-200 dark:shadow-blue-900/30 gap-2"
              >
                {isSubmitting ? (
                  <IconLoader2 size={20} className="animate-spin" />
                ) : (
                  <>Create My Account <IconArrowRight size={20} /></>
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-black hover:underline">
              Sign In instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
