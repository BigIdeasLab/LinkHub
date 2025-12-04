"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

// Import the onboarding component
import Onboarding from "../lib/index";

export default function OnboardingStepPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return <Onboarding />;
}
