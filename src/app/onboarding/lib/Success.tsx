import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Copy,
  Download,
  Share2,
  Twitter,
  Instagram,
} from "lucide-react";
import { useOnboarding } from "./context";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { THEME_PRESETS } from "@/lib/theme-presets";

export default function Success() {
  const { data } = useOnboarding();
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Save onboarding data to backend
    const saveProfile = async () => {
      if (!user || isSaving) return;

      setIsSaving(true);
      try {
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
          
          const themeName = themeMap[data.theme] || "Classic Light";
          const preset = THEME_PRESETS.find(p => p.name === themeName);
          return preset?.theme || THEME_PRESETS[0].theme;
        };
        
        const themeSettings = getThemeSettings();
        
        const response = await fetch("/api/me/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: data.username,
            displayName: data.displayName,
            bio: data.bio,
            theme: themeSettings,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to save profile");
        }

        // Add links
        for (const link of data.links) {
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
        
        // Mark onboarding as complete
        await fetch("/api/me/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            onboarded: true,
          }),
        });
        
        // Refresh user state in auth context
        await refreshUser();
        
        toast.success("Profile saved successfully!");
        setIsSaving(false);
      } catch (error) {
        console.error("Failed to save profile:", error);
        toast.error("Failed to save your profile data");
        setIsSaving(false);
      }
    };

    // Only save once when component mounts and user exists
    if (user && !isSaving) {
      saveProfile();
    }
  }, [user?.id]); // Only depend on user.id to avoid infinite loops

  const linkHubUrl = `linkhub.com/${data.username}`;
  const fullUrl = `https://linkhub.com/${data.username}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const text = `Check out my LinkHub! I've consolidated all my important links in one place. ${fullUrl}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const handleShareInstagram = () => {
    toast.success(`Share this link on Instagram: ${linkHubUrl}`);
  };

  return (
    <div className="space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
          <CheckCircle2 className="h-20 w-20 text-primary relative" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Your LinkHub is live!</h1>
        <p className="text-lg text-foreground/70">
          Congratulations! Your profile is now live and ready to share.
        </p>
      </div>

      {/* URL Display */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <p className="text-sm text-foreground/70">Your LinkHub URL:</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-muted p-3">
            <p className="font-mono text-sm font-medium break-all">
              {linkHubUrl}
            </p>
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={handleCopyUrl}
            className="flex-shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        {copied && (
          <p className="text-sm text-primary font-medium">✓ Copied!</p>
        )}
      </div>

      {/* QR Code (placeholder) */}
      <div className="rounded-lg border border-border bg-muted/30 p-6 flex flex-col items-center justify-center gap-4">
        <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
          <span className="text-4xl">📱</span>
        </div>
        <p className="text-sm text-foreground/70">
          Download QR Code (coming soon)
        </p>
      </div>

      {/* Share Options */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Share your LinkHub:</p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleShareTwitter}
            variant="outline"
            className="gap-2"
          >
            <Twitter className="h-4 w-4" />
            Share on Twitter
          </Button>
          <Button
            onClick={handleShareInstagram}
            variant="outline"
            className="gap-2"
          >
            <Instagram className="h-4 w-4" />
            Share on Instagram
          </Button>
        </div>
      </div>

      {/* Preview Link */}
      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center space-y-3">
        <p className="text-sm font-medium">
          Preview your LinkHub before sharing:
        </p>
        <Link
          href={`/p/${data.username}`}
          className="inline-block text-primary hover:underline font-medium"
        >
          View Your Page →
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-6">
        <Link href={`/p/${data.username}`} className="flex-1">
          <Button className="w-full">View My LinkHub</Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
