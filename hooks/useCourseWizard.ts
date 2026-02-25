import { create } from "zustand";

type WizardStep = 1 | 2 | 3;

interface WizardState {
  currentStep: WizardStep;
  courseId: string | null;
  setStep: (step: WizardStep) => void;
  setCourseId: (id: string) => void;
  reset: () => void;
}

export const useCourseWizard = create<WizardState>((set) => ({
  currentStep: 1,
  courseId: null,
  setStep: (step) => set({ currentStep: step }),
  setCourseId: (id) => set({ courseId: id }),
  reset: () => set({ currentStep: 1, courseId: null }),
}));
