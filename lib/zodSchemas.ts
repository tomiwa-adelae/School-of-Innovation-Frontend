import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  phoneNumber: z
    .string()
    .regex(/^(\+?\d{10,15})$/, { message: "Enter a valid phone number." }),
  subject: z.string().min(2, { message: "Please select a subject" }),
  message: z.string().min(2, { message: "Message is required" }),
});

export const LoginFormSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export const RegisterFormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      message: "You must accept the Terms of Service and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 attach the error to confirmPassword
  });

export const forgotPasswordFormSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
});

export const resetPasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number.",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character.",
    }),
  token: z.string().min(2, {
    message: "Token must be at least 2 characters.",
  }),
});

export const VerifyCodeSchema = z.object({
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  otp: z
    .string()
    .min(6, {
      message: "Code must be 6 characters.",
    })
    .max(6, { message: "Code must be 6 characters" }),
});

export const NewPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(6, {
        message: "Code must be 6 characters.",
      })
      .max(6, { message: "Code must be 6 characters" }),
    email: z.string().email().min(2, {
      message: "Email must be at least 2 characters.",
    }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number.",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(2, { message: "Enter your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 attach the error to confirmPassword
  });

// ─── Course Builder Schemas ───────────────────────────────────────────────────

// Only the title gates creating a draft. Everything else is filled in over
// time and enforced at publish time by GET /courses/:id/readiness — so an
// instructor is never blocked by a field they have not thought about yet.
export const CourseTitleSchema = z.object({
  title: z.string().min(5, "Give your course a title of at least 5 characters").max(120),
});
export type CourseTitleInput = z.infer<typeof CourseTitleSchema>;

export const CourseBasicsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  shortDescription: z.string().max(200, "Keep under 200 characters").optional().or(z.literal("")),
  description: z.string().optional(),
  categoryId: z.string().optional().or(z.literal("")),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"]).default("ALL_LEVELS"),
  language: z.string().default("English"),
  pricingType: z.enum(["FREE", "PAID", "SUBSCRIPTION"]).default("FREE"),
  price: z.number().min(0).optional(),
  currency: z.string().default("USD"),
  thumbnail: z.string().optional().or(z.literal("")),
  previewVideo: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  // Not required to save a draft — the publish checklist is what enforces
  // completeness, so a half-finished course still autosaves cleanly.
  learningOutcomes: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  targetAudience: z.array(z.string()).default([]),
});
export type CourseBasicsInput = z.infer<typeof CourseBasicsSchema>;

export const ChapterSchema = z.object({
  title: z.string().min(2, "Title required").max(100),
  shortDescription: z.string().max(200).optional().or(z.literal("")),
  description: z.string().optional(),
  isFree: z.boolean().default(false),
});
export type ChapterInput = z.infer<typeof ChapterSchema>;

export const LessonSchema = z.object({
  title: z.string().min(2, "Title required").max(100),
  shortDescription: z.string().max(200).optional().or(z.literal("")),
  description: z.string().optional(),
  videoUrl: z.string().optional().or(z.literal("")),
  thumbnailUrl: z.string().optional().or(z.literal("")),
  duration: z.number().int().min(0).default(0),
  isFree: z.boolean().default(false),
  isDownloadable: z.boolean().default(false),
});
export type LessonInput = z.infer<typeof LessonSchema>;

// ─────────────────────────────────────────────────────────────────────────────

export const OnboardingProfileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be selected" }),
  country: z.string().min(2, { message: "Country must be selected" }),
  image: z.string().optional(),
  dob: z.any().optional(),
  gender: z.string().optional(),
  phoneNumber: z
    .string()
    .min(7, "Phone number required")
    .optional()
    .or(z.literal("")), // allow blank but treat as invalid
});

// ─── Live Class Schema ────────────────────────────────────────────────────────
// Deliberately short: six decisions, not the twelve a course asks for. The
// meeting link is only required at publish time, so a draft can be roughed out
// before the host has created the Zoom/Meet room.

export const LiveSessionSchema = z
  .object({
    title: z.string().min(5, "Give the class a title of at least 5 characters").max(140),
    description: z.string().max(4000).optional().or(z.literal("")),
    coverImage: z.string().optional().or(z.literal("")),
    date: z.string().min(1, "Pick a date"),
    startTime: z.string().min(1, "Pick a start time"),
    durationMinutes: z.number().int().min(15, "At least 15 minutes").max(720),
    timezone: z.string().default("Africa/Lagos"),
    capacity: z.number().int().min(1).optional(),
    isFree: z.boolean().default(false),
    price: z.number().min(0).optional(),
    currency: z.string().default("NGN"),
    meetingUrl: z.string().url("Enter a valid meeting link").optional().or(z.literal("")),
    passcode: z.string().max(64).optional().or(z.literal("")),
  })
  .refine((data) => data.isFree || (data.price !== undefined && data.price > 0), {
    message: "Set a price, or mark the class as free",
    path: ["price"],
  });

export type LiveSessionInput = z.infer<typeof LiveSessionSchema>;
