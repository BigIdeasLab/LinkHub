"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProfileResponse, Link as LinkType, ThemeSettings } from "@/shared/api";
import { toast } from "sonner";

const DEFAULT_THEME: ThemeSettings = {
  layout: "stacked",
  primaryColor: "#6366f1",
  secondaryColor: "#ec4899",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  fontFamily: "sans",
  buttonStyle: {
    shape: "rounded",
    fill: "solid",
    shadow: "subtle",
  },
};

export default function PublicProfile({ username }: { username: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setNotFound(true);
        return;
      }

      try {
        // Fetch profile
        const profileRes = await fetch(`/api/p/${username}`);
        if (!profileRes.ok) {
          setNotFound(true);
          return;
        }

        const profileData: ProfileResponse = await profileRes.json();
        setProfile(profileData);

        // Parse theme
        try {
          const parsedTheme =
            typeof profileData.theme === "string"
              ? JSON.parse(profileData.theme)
              : profileData.theme;
          setTheme({ ...DEFAULT_THEME, ...parsedTheme });
        } catch (e) {
          setTheme(DEFAULT_THEME);
        }

        // Fetch links for this profile
        const linksRes = await fetch(`/api/p/${username}/links`);
        if (linksRes.ok) {
          const linksData = await linksRes.json();
          setLinks(linksData);
        }

        // Track page view
        try {
          await fetch(`/api/p/${username}/view`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userAgent: navigator.userAgent,
              referrer: document.referrer,
            }),
          });
        } catch (err) {
          console.error("Failed to track page view:", err);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (notFound) {
    router.push("/not-found");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    router.push("/not-found");
    return null;
  }

  const fontFamilyMap = {
    sans: "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    modern: "ui-monospace, Menlo, monospace",
  };

  const buttonShapeClass = {
    rounded: "rounded-lg",
    square: "rounded-none",
    pill: "rounded-full",
  };

  const buttonFillClass = {
    solid: "bg-primary text-white hover:opacity-90",
    outline:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary/5",
    gradient:
      "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90",
  };

  const buttonShadowClass = {
    none: "",
    subtle: "shadow-md",
    prominent: "shadow-xl",
  };

  const layoutClass = {
    stacked: "flex flex-col gap-3",
    grid: "grid grid-cols-2 gap-3",
    minimal: "flex flex-col gap-2 max-w-sm",
  };

  const handleLinkClick = async (linkId: string) => {
    try {
      await fetch(`/api/links/${linkId}/click`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to track click:", err);
    }
  };

  const activeLinks = links.filter((link) => link.isActive);

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: fontFamilyMap[theme.fontFamily],
      }}
    >
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Avatar */}
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-24 h-24 rounded-full object-cover border-4"
              style={{ borderColor: theme.primaryColor }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center border-4"
              style={{ borderColor: theme.primaryColor }}
            >
              <span className="text-4xl">👤</span>
            </div>
          )}

          {/* Name & Bio */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              {profile.displayName || profile.username}
            </h1>
            {profile.bio && (
              <p className="text-sm opacity-80 max-w-sm">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Links */}
        {activeLinks.length > 0 ? (
          <div className={layoutClass[theme.layout]}>
            {activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className={`px-6 py-3 text-center font-medium text-sm transition ${buttonShapeClass[theme.buttonStyle.shape]} ${buttonShadowClass[theme.buttonStyle.shadow]}`}
                style={
                  theme.buttonStyle.fill === "solid"
                    ? {
                        backgroundColor: theme.primaryColor,
                        color: "white",
                      }
                    : theme.buttonStyle.fill === "outline"
                      ? {
                          borderColor: theme.primaryColor,
                          color: theme.primaryColor,
                          borderWidth: "2px",
                          backgroundColor: "transparent",
                        }
                      : {
                          backgroundImage: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`,
                          color: "white",
                        }
                }
              >
                {link.title}
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 opacity-50">
            <p>No links added yet</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs opacity-50">
          <p>
            Made with{" "}
            <span role="img" aria-label="heart">
              ❤️
            </span>{" "}
            by LinkHub
          </p>
        </div>
      </div>
    </div>
  );
}
