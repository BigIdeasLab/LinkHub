import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is logged in and hasn't completed onboarding
    if (user && !user.onboarded) {
      router.push("/onboarding/step-1");
    }
  }, [user, router]);

  return <>{children}</>;
}
