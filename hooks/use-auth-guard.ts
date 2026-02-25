"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const { user, _hasHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!user.onboardingCompleted) {
      router.push("/onboarding");
    }
  }, [user, _hasHydrated, router]);

  return {
    user,
    isReady: _hasHydrated && !!user && user.onboardingCompleted,
  };
}
