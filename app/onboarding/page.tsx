"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { updateData } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconRocket,
  IconBook,
  IconChalkboard,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconLoader2,
  IconSchool,
  IconUsers,
  IconBriefcase,
  IconCode,
  IconPalette,
  IconDeviceLaptop,
  IconMath,
  IconLanguage,
  IconMusic,
  IconCamera,
} from "@tabler/icons-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Role = "USER" | "INSTRUCTOR";

interface OnboardingData {
  role: Role | null;
  phoneNumber: string;
  bio: string;
  interests: string[];
}

// ── Step indicators ──────────────────────────────────────────────────────────

const STEPS = ["Choose Role", "Your Profile", "Finish"];

// ── Expertise options for instructors ────────────────────────────────────────

const expertiseOptions = [
  { label: "Web Development", icon: IconCode },
  { label: "Design & UI/UX", icon: IconPalette },
  { label: "Data Science", icon: IconMath },
  { label: "Mobile Dev", icon: IconDeviceLaptop },
  { label: "Digital Marketing", icon: IconBriefcase },
  { label: "Photography", icon: IconCamera },
  { label: "Music & Audio", icon: IconMusic },
  { label: "Languages", icon: IconLanguage },
];

// ── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser, _hasHydrated } = useAuth();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    role: null,
    phoneNumber: "",
    bio: "",
    interests: [],
  });

  // Guard: redirect if not logged in or already onboarded
  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user) {
      router.push("/login");
    } else if (user.onboardingCompleted) {
      redirectByRole(user.role);
    }
  }, [user, _hasHydrated, router]);

  function redirectByRole(role: string) {
    if (role === "ADMINISTRATOR") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  function toggleInterest(label: string) {
    setData((d) => ({
      ...d,
      interests: d.interests.includes(label)
        ? d.interests.filter((i) => i !== label)
        : [...d.interests, label],
    }));
  }

  async function handleFinish() {
    if (!data.role) return;
    setIsSubmitting(true);
    try {
      const res = await updateData<{ user: any }>("/users/onboarding", {
        role: data.role,
        phoneNumber: data.phoneNumber || undefined,
        bio: data.bio || undefined,
        interests: data.interests,
      });

      setUser(res.user);
      toast.success(
        data.role === "INSTRUCTOR"
          ? "Account created! Your instructor application is under review."
          : "You're all set! Welcome to School of Innovation."
      );
      redirectByRole(res.user.role);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Something went wrong.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!_hasHydrated || !user || user.onboardingCompleted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <IconRocket size={18} className="text-white" />
          </div>
          <span className="font-black text-sm tracking-tighter uppercase">
            School of Innovation
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">

          {/* Step pills */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                    i < step
                      ? "bg-blue-600 text-white"
                      : i === step
                        ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  )}
                >
                  {i < step ? <IconCheck size={12} /> : null}
                  {label}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 0: Choose Role ─────────────────────────────────── */}
          {step === 0 && (
            <div className="text-center">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                Welcome, {user.firstName}! 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-10">
                How would you like to use School of Innovation?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {/* Student card */}
                <button
                  type="button"
                  onClick={() => setData((d) => ({ ...d, role: "USER" }))}
                  className={cn(
                    "group p-8 rounded-3xl border-2 text-left transition-all duration-200 cursor-pointer",
                    data.role === "USER"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 shadow-xl shadow-blue-100 dark:shadow-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 hover:shadow-lg"
                  )}
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors",
                      data.role === "USER"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                    )}
                  >
                    <IconBook size={28} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                    I&apos;m a Student
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    I want to learn new skills, take courses, and earn certificates from Africa&apos;s top instructors.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Courses", "Certificates", "Progress Tracking"].map((t) => (
                      <span
                        key={t}
                        className={cn(
                          "text-xs font-semibold px-3 py-1 rounded-full",
                          data.role === "USER"
                            ? "bg-blue-600/10 text-blue-700 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        )}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {data.role === "USER" && (
                    <div className="mt-5 flex items-center gap-2 text-blue-600 font-bold text-sm">
                      <IconCheck size={16} /> Selected
                    </div>
                  )}
                </button>

                {/* Instructor card */}
                <button
                  type="button"
                  onClick={() => setData((d) => ({ ...d, role: "INSTRUCTOR" }))}
                  className={cn(
                    "group p-8 rounded-3xl border-2 text-left transition-all duration-200 cursor-pointer",
                    data.role === "INSTRUCTOR"
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-950/40 shadow-xl shadow-purple-100 dark:shadow-purple-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-purple-300 hover:shadow-lg"
                  )}
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors",
                      data.role === "INSTRUCTOR"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600"
                    )}
                  >
                    <IconChalkboard size={28} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                    I&apos;m an Instructor
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    I want to create and sell courses, mentor students, and share my expertise with Africa&apos;s next generation.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Create Courses", "Earn Revenue", "Mentorship"].map((t) => (
                      <span
                        key={t}
                        className={cn(
                          "text-xs font-semibold px-3 py-1 rounded-full",
                          data.role === "INSTRUCTOR"
                            ? "bg-purple-600/10 text-purple-700 dark:text-purple-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        )}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {data.role === "INSTRUCTOR" && (
                    <div className="mt-5 flex items-center gap-2 text-purple-600 font-bold text-sm">
                      <IconCheck size={16} /> Selected — requires admin approval
                    </div>
                  )}
                </button>
              </div>

              <Button
                onClick={() => setStep(1)}
                disabled={!data.role}
                className="mt-10 h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black gap-2"
              >
                Continue <IconArrowRight size={18} />
              </Button>
            </div>
          )}

          {/* ── STEP 1: Profile ─────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 text-center">
                Complete your profile
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-10 text-center">
                {data.role === "INSTRUCTOR"
                  ? "Tell us about your teaching experience and expertise."
                  : "Just a few more details to personalise your learning experience."}
              </p>

              <div className="space-y-6 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={data.phoneNumber}
                    onChange={(e) =>
                      setData((d) => ({ ...d, phoneNumber: e.target.value }))
                    }
                    className="py-5 rounded-xl"
                  />
                </div>

                {/* Bio — instructors only */}
                {data.role === "INSTRUCTOR" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Short Bio <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      placeholder="Tell students a bit about your background and teaching style..."
                      value={data.bio}
                      onChange={(e) =>
                        setData((d) => ({ ...d, bio: e.target.value }))
                      }
                      rows={4}
                      maxLength={500}
                      className="w-full px-3 py-3 rounded-xl border border-input bg-background text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {data.bio.length}/500
                    </p>
                  </div>
                )}

                {/* Expertise — instructors only */}
                {data.role === "INSTRUCTOR" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Areas of Expertise{" "}
                      <span className="text-gray-400 font-normal">(pick all that apply)</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {expertiseOptions.map(({ label, icon: Icon }) => {
                        const selected = data.interests.includes(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleInterest(label)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all",
                              selected
                                ? "border-purple-600 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300"
                                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                            )}
                          >
                            <Icon size={16} />
                            {label}
                            {selected && <IconCheck size={14} className="text-purple-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Student interests */}
                {data.role === "USER" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      Learning Interests{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {expertiseOptions.map(({ label, icon: Icon }) => {
                        const selected = data.interests.includes(label);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleInterest(label)}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all",
                              selected
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                            )}
                          >
                            <Icon size={16} />
                            {label}
                            {selected && <IconCheck size={14} className="text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setStep(0)}
                  className="h-12 px-8 rounded-2xl font-bold gap-2"
                >
                  <IconArrowLeft size={18} /> Back
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black gap-2"
                >
                  Continue <IconArrowRight size={18} />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Review & Submit ──────────────────────────────── */}
          {step === 2 && (
            <div className="text-center">
              <div
                className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6",
                  data.role === "INSTRUCTOR"
                    ? "bg-purple-100 dark:bg-purple-950/40 text-purple-600"
                    : "bg-blue-100 dark:bg-blue-950/40 text-blue-600"
                )}
              >
                {data.role === "INSTRUCTOR" ? (
                  <IconChalkboard size={40} />
                ) : (
                  <IconSchool size={40} />
                )}
              </div>

              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                {data.role === "INSTRUCTOR"
                  ? "Almost there, future instructor!"
                  : "You're ready to start learning!"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                {data.role === "INSTRUCTOR"
                  ? "Your instructor application will be reviewed by our admin team. You'll have limited access while we review it — usually within 48 hours."
                  : "Your account is set up. Dive in and start exploring 50+ courses built for Africa's next generation of builders."}
              </p>

              {/* Summary card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 text-left space-y-4 mb-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    {data.role === "INSTRUCTOR" ? (
                      <IconChalkboard size={20} className="text-purple-600" />
                    ) : (
                      <IconBook size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                      Role
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {data.role === "INSTRUCTOR" ? "Instructor (Pending Approval)" : "Student"}
                    </p>
                  </div>
                </div>

                {data.interests.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                      <IconUsers size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">
                        {data.role === "INSTRUCTOR" ? "Expertise" : "Interests"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {data.interests.map((i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {i}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {data.role === "INSTRUCTOR" && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-8 text-left">
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
                    ⏳ What happens next?
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                    Our admin team will review your application. You&apos;ll be notified once approved. In the meantime, you can explore the platform with limited access.
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="h-12 px-8 rounded-2xl font-bold gap-2"
                >
                  <IconArrowLeft size={18} /> Back
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className={cn(
                    "h-12 px-10 text-white rounded-2xl font-black gap-2",
                    data.role === "INSTRUCTOR"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  {isSubmitting ? (
                    <IconLoader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      {data.role === "INSTRUCTOR"
                        ? "Submit Application"
                        : "Enter Dashboard"}{" "}
                      <IconArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
