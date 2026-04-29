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
import { Logo } from "@/components/Logo";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Loader } from "@/components/Loader";

type LoginFormInput = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const { setUser, setAccessToken, setRefreshToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const form = useForm<LoginFormInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(LoginFormSchema as any),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormInput) => {
    try {
      const data = await postData<{ user: any; access_token: string; refresh_token: string }>("/auth/login", values);
      setUser(data.user);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      toast.success(`Welcome back, ${data.user?.firstName}!`);
      if (!data.user?.onboardingCompleted) {
        router.push("/onboarding");
      } else if (data.user?.role === "ADMINISTRATOR") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Invalid credentials. Please try again.";
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 relative overflow-hidden flex-col justify-between py-16">
        <div className="container flex-col justify-between lg:flex h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#2563eb33_0%,transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,#4f46e522_0%,transparent_50%)]" />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              Welcome back to the <br />
              <span className="text-blue-500">Next Generation.</span>
            </h2>
            <p className="text-gray-400 text-base max-w-md">
              Log in to continue your journey, access your projects, and connect
              with your mentors.
            </p>
          </div>

          <div className="relative z-10 bg-white/5 border border-white/10 p-8 rounded-md backdrop-blur-md">
            <p className="text-white font-medium mb-4 italic">
              "This platform changed my career trajectory in 3 months. The MERN
              stack course is top-tier!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100?u=stu"
                className="w-10 h-10 rounded-full border-2 border-blue-500"
                alt="Student"
              />
              <div>
                <p className="text-sm font-bold text-white">Chima Opara</p>
                <p className="text-xs text-gray-500">
                  Frontend Engineer @ Paystack
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="container max-w-lg">
          <Logo />

          <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white mb-1">
            Student Login
          </h3>
          <p className="text-muted-foreground text-base mb-8">
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type={isVisible ? "text" : "password"}
                          {...field}
                          placeholder="••••••••"
                        />
                        <InputGroupAddon>
                          <IconLock />
                        </InputGroupAddon>
                        <InputGroupAddon>
                          <Button
                            className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                            variant={"ghost"}
                            size="icon"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label={
                              isVisible ? "Hide password" : "Show password"
                            }
                            aria-pressed={isVisible}
                            aria-controls="password"
                          >
                            {isVisible ? (
                              <IconEyeOff
                                className="size-4"
                                aria-hidden="true"
                              />
                            ) : (
                              <IconEye className="size-4" aria-hidden="true" />
                            )}
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader /> : "Sign in"}
              </Button>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </Link>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-gray-950 px-3 text-muted-foreground font-semibold">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full">
                <IconBrandGoogle />
                Login with Google
              </Button>
            </form>
          </Form>

          <p className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
