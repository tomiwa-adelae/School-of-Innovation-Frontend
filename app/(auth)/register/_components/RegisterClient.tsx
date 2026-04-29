"use client";

import { useMemo, useState } from "react";
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
  IconCheck,
  IconX,
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Loader } from "@/components/Loader";

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
  const { setUser, setAccessToken, setRefreshToken } = useAuth();
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
  const acceptTerms = form.watch("acceptTerms");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isConfirmVisible, setConfirmIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const toggleConfirmVisibility = () =>
    setConfirmIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: "At least 1 special character",
      },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  const onSubmit = async (values: RegisterFormInput) => {
    try {
      const data = await postData<{ user: any; access_token: string; refresh_token: string }>("/auth/register", values);
      setUser(data.user);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      toast.success("Account created! Let's set up your profile.");
      router.push("/onboarding");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        "Registration failed. Please try again.";
      toast.error(Array.isArray(message) ? message[0] : message);
    }
  };

  const { isSubmitting } = form.formState;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-center py-16 text-white">
        <div className="container flex flex-col justify-center">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-12">
              Start your <br />
              <span className="text-blue-200">Innovation Journey.</span>
            </h2>

            <div className="space-y-10">
              {[
                {
                  title: "Create your Profile",
                  desc: "Join 2,000+ African visionaries.",
                  icon: <IconUser className="size-5" />,
                },
                {
                  title: "Choose your Track",
                  desc: "Select from 50+ specialized courses.",
                  icon: <IconSchool className="size-5" />,
                },
                {
                  title: "Start Building",
                  desc: "Access labs and mentorship immediately.",
                  icon: <IconDeviceLaptop className="size-5" />,
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-3 group">
                  <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-primary transition-all duration-300">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{step.title}</h4>
                    <p className="text-blue-100 opacity-80 text-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/20">
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
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center py-16 overflow-y-auto">
        <div className="container">
          <h3 className="text-3xl font-bold mb-2">Create Account</h3>
          <p className="text-muted-foreground text-base mb-8">
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
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput {...field} placeholder="John" />
                          <InputGroupAddon>
                            <IconUser />
                          </InputGroupAddon>
                        </InputGroup>
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput {...field} placeholder="Doe" />
                          <InputGroupAddon>
                            <IconUser />
                          </InputGroupAddon>
                        </InputGroup>
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pe-9"
                          placeholder="Password"
                          type={isVisible ? "text" : "password"}
                          {...field}
                        />
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
                            <IconEyeOff className="size-4" aria-hidden="true" />
                          ) : (
                            <IconEye className="size-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div
                      className={cn(
                        password.length !== 0
                          ? "block mt-2 space-y-3"
                          : "hidden",
                      )}
                    >
                      <Progress
                        value={(strengthScore / 5) * 100}
                        className={cn("h-1")}
                      />
                      {/* Password strength description */}
                      <p className="text-foreground mb-2 text-sm font-medium">
                        {getStrengthText(strengthScore)}. Must contain:
                      </p>

                      {/* Password requirements list */}
                      <ul
                        className="space-y-1.5"
                        aria-label="Password requirements"
                      >
                        {strength.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            {req.met ? (
                              <IconCheck
                                size={16}
                                className="text-emerald-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <IconX
                                size={16}
                                className="text-muted-foreground/80"
                                aria-hidden="true"
                              />
                            )}
                            <span
                              className={`text-xs ${
                                req.met
                                  ? "text-emerald-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {req.text}
                              <span className="sr-only">
                                {req.met
                                  ? " - Requirement met"
                                  : " - Requirement not met"}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isConfirmVisible ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <Button
                          className="absolute top-[50%] translate-y-[-50%] end-1 text-muted-foreground/80"
                          variant={"ghost"}
                          size="icon"
                          type="button"
                          onClick={toggleConfirmVisibility}
                          // FIX: Use isConfirmVisible for accessibility label
                          aria-label={
                            isConfirmVisible ? "Hide password" : "Show password"
                          }
                          aria-pressed={isConfirmVisible}
                          aria-controls="password"
                        >
                          {isConfirmVisible ? ( // FIX: Use isConfirmVisible for icon
                            <IconEyeOff className="size-4" aria-hidden="true" />
                          ) : (
                            <IconEye className="size-4" aria-hidden="true" />
                          )}
                        </Button>
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
                        <Link
                          href="/terms"
                          className="text-primary font-bold underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary font-bold underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader text="Creating account..." />
                ) : (
                  <>Create My Account</>
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign In instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
