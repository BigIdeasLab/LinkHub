import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useOnboarding } from "./context";
import { THEME_PRESETS } from "@/lib/theme-presets";

export default function Step5Profile() {
  const { data, updateData, prevStep } = useOnboarding();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [bio, setBio] = useState(data.bio);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(data.avatarUrl);
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = async () => {
    setIsSaving(true);
    try {
      // Update local data with final bio
      const finalData = {
        ...data,
        bio,
        avatarUrl: previewUrl || data.avatarUrl,
      };
      updateData(finalData);

      // Save profile to backend
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Map theme ID to preset theme
      const getThemeSettings = () => {
        const themeMap: { [key: string]: string } = {
          "dark-mode": "Dark Mode",
          "ocean-blue": "Ocean Blue",
          "sunset": "Sunset",
          "purple-dream": "Purple Dream",
        };
        
        const themeName = themeMap[finalData.theme] || "Classic Light";
        const preset = THEME_PRESETS.find(p => p.name === themeName);
        return preset?.theme || THEME_PRESETS[0].theme;
      };

      // Build complete profile update with all onboarding data
      const profileUpdate: any = {
        displayName: finalData.displayName,
        bio: finalData.bio,
        username: finalData.username,
        theme: getThemeSettings(),
        onboarded: true,
      };

      // Only send avatarUrl if it's not a data URL (file upload handling would be separate)
      if (previewUrl && !previewUrl.startsWith("data:")) {
        profileUpdate.avatarUrl = previewUrl;
      } else if (finalData.avatarUrl && !finalData.avatarUrl.startsWith("data:")) {
        profileUpdate.avatarUrl = finalData.avatarUrl;
      }



      const response = await fetch("/api/me/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileUpdate),
      });

      // Add links
      for (const link of finalData.links) {
        console.log("Step 5 - Sending link:", link);
        await fetch("/api/me/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: link.title,
            url: link.url,
            platform: link.platform,
          }),
        });
      }

      if (!response.ok) {
        let errorMessage = "Failed to save profile";
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      // Invalidate profile query to refresh onboarded status
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success("Profile published successfully!");
      
      // Small delay to ensure backend has fully processed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to preview page after successful save
      router.push("/preview");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save profile"
      );
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Final touches</h2>
        <p className="text-foreground/70">
          Add your photo and bio to make your profile complete.
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="space-y-4">
        <Label>Profile picture</Label>
        <div className="space-y-4">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">📷</span>
                )}
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium text-sm mb-1">
                Drag your image here or click to browse
              </p>
              <p className="text-xs text-foreground/60">
                Recommended size: 400×400px
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <div className="space-y-2">
          <Textarea
            id="bio"
            placeholder="Tell your visitors who you are and what you do..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            className="resize-none"
            rows={4}
          />
          <p className="text-xs text-foreground/60">
            {bio.length}/160 characters
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2">
        <p className="text-sm font-medium text-primary">Almost done! 🎉</p>
        <p className="text-sm text-foreground/70">
          Your LinkHub will be published immediately after this step.
        </p>
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
          type="button"
          onClick={handleNext}
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving ? "Publishing..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
