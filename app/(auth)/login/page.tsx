"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  IconMail,
  IconLock,
  IconBrandGoogle,
  IconArrowRight,
  IconChevronLeft,
  IconRocket,
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
import { LoginFormSchema } from "@/lib/zodSchemas";
import { postData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";

type LoginFormInput = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(LoginFormSchema as any),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormInput) => {
    try {
      const data = await postData<{ user: any }>("/auth/login", values);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user?.firstName}!`);
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Invalid credentials. Please try again.";
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#2563eb33_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,#4f46e522_0%,transparent_50%)]" />

        <div className="relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group w-fit"
          >
            <IconChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <IconRocket size={24} className="text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">INNOVATION 4.0</span>
          </div>

          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Welcome back to the <br />
            <span className="text-blue-500">Next Generation.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Log in to continue your journey, access your projects, and connect with your mentors.
          </p>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
          <p className="text-white font-medium mb-4 italic">
            "This platform changed my career trajectory in 3 months. The MERN stack course is top-tier!"
          </p>
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100?u=stu"
              className="w-10 h-10 rounded-full border-2 border-blue-500"
              alt="Student"
            />
            <div>
              <p className="text-sm font-bold text-white">Chima Opara</p>
              <p className="text-xs text-gray-500">Frontend Engineer @ Paystack</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <span className="text-2xl font-black text-blue-600 tracking-tighter">INNOVATION 4.0</span>
          </div>

          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Student Login</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Enter your credentials to access your dashboard.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="font-bold">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
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
                    <FormMessage />
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
                  <>Sign In <IconArrowRight size={20} /></>
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-950 px-3 text-gray-400 font-bold tracking-widest">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-2xl font-bold gap-3"
              >
                <IconBrandGoogle size={20} />
                Login with Google
              </Button>
            </form>
          </Form>

          <p className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-black hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
