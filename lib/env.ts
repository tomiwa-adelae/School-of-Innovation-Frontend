import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_ADMIN_EMAIL_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_ADMIN_PHONE_NUMBER: z.string().min(1),
    NEXT_PUBLIC_BACKEND_URL: z.string().min(1),
    NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_ADMIN_EMAIL_ADDRESS:
      process.env.NEXT_PUBLIC_ADMIN_EMAIL_ADDRESS,
    NEXT_PUBLIC_ADMIN_PHONE_NUMBER: process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS:
      process.env.NEXT_PUBLIC_SUPPORT_EMAIL_ADDRESS,
    NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
  },
});
