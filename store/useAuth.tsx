import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string | null;
  image: string | null;
  dob: string | null;
  createdAt: string | null;
  city: string | null;
  address: string | null;
  state: string | null;
  country: string | null;
  role: "USER" | "INSTRUCTOR" | "ADMINISTRATOR" | string;
  gender: string | null;
  bio: string | null;
  interests: string[];
  onboardingCompleted: boolean;
  instructorStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
} | null;

type AuthState = {
  user: User;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  clearUser: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearUser: () => set({ user: null, accessToken: null, refreshToken: null }),
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: "auth-user",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
