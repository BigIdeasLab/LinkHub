import React, { createContext, useContext, useState } from "react";

export interface OnboardingData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  category: string;
  goals: string[];
  links: Array<{
    id: string;
    title: string;
    url: string;
    platform: string;
  }>;
  theme: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    username: "",
    displayName: "",
    bio: "",
    avatarUrl: null,
    category: "",
    goals: [],
    links: [],
    theme: "dark-mode",
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <OnboardingContext.Provider
      value={{ data, updateData, currentStep, goToStep, nextStep, prevStep }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
};
