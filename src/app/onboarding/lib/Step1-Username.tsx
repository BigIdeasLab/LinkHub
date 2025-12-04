import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useOnboarding } from "./context";
import { useState } from "react";

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Username can only contain letters, numbers, and hyphens",
    ),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be at most 100 characters"),
});

type UsernameFormData = z.infer<typeof usernameSchema>;

export default function Step1Username() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: data.username,
      displayName: data.displayName,
    },
    mode: "onChange",
  });

  const username = watch("username");

  // Check username availability via backend
  const checkAvailability = async (username: string) => {
    if (username.length < 3) return;
    setIsChecking(true);
    try {
      const response = await fetch(
        `/api/me/profile/check-username?username=${encodeURIComponent(username)}`
      );
      const result = await response.json();
      setIsAvailable(result.available);
    } catch (error) {
      console.error("Failed to check username availability:", error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const onSubmit = (data: UsernameFormData) => {
    if (isAvailable) {
      updateData({
        username: data.username,
        displayName: data.displayName,
      });
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Choose your username</h2>
        <p className="text-foreground/70">
          This will be your unique LinkHub URL: linkhub.com/
          <span className="font-semibold text-primary">
            {username || "yourname"}
          </span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input
              {...register("username")}
              id="username"
              placeholder="johnny_appleseed"
              className="pr-12"
              onChange={(e) => {
                register("username").onChange(e);
                setIsAvailable(null);
                if (e.target.value.length >= 3) {
                  checkAvailability(e.target.value);
                }
              }}
            />
            {isChecking && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
            {!isChecking && isAvailable === true && (
              <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
            )}
            {!isChecking && isAvailable === false && (
              <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
            )}
          </div>
          {errors.username && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.username.message}
            </div>
          )}
          {isAvailable === false && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              This username is taken. Try another.
            </div>
          )}
        </div>

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            {...register("displayName")}
            id="displayName"
            placeholder="Johnny Appleseed"
          />
          {errors.displayName && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {errors.displayName.message}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!isValid || !isAvailable || isChecking}
            className="flex-1"
          >
            Next: Category & Goals
          </Button>
        </div>
      </form>
    </div>
  );
}
