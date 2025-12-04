"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

export function OnboardingCompleteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If user is logged in and has completed onboarding, redirect to dashboard
    if (user && user.onboarded) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return <>{children}</>;
}
