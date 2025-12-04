"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useProfile, useUpdateProfile, useCheckUsername } from "@/hooks/useProfile";
import { toast } from "sonner";

export default function SettingsTab() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  // Check if username is available (debounced)
  const { data: usernameCheck } = useCheckUsername(username);
  const isUsernameAvailable = usernameCheck?.available !== false;
  const hasChanges = username !== (profile?.username || "") ||
    displayName !== (profile?.displayName || "") ||
    bio !== (profile?.bio || "");

  const handleSaveChanges = async () => {
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    if (username !== profile?.username && !isUsernameAvailable) {
      toast.error("Username is already taken");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        username,
        displayName,
        bio,
      });
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Account Info */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Account Information</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  id="username"
                  placeholder="your-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                />
                {username !== (profile?.username || "") && (
                  <p
                    className={`text-xs mt-1 ${
                      isUsernameAvailable
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isUsernameAvailable ? "✓ Available" : "✗ Taken"}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              placeholder="Your full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              placeholder="Tell visitors about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
          </div>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges || isSaving || isPending}
          >
            {isSaving || isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Plan */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Subscription Plan</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Free Plan</p>
              <p className="text-sm text-foreground/70">
                15 links • Basic customization • No analytics
              </p>
            </div>
            <span className="text-sm font-medium">Current</span>
          </div>
          <Button variant="outline">Upgrade to Pro</Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-destructive bg-destructive/5 p-6 space-y-4">
        <h3 className="font-semibold text-destructive">Danger Zone</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-foreground/70 mb-3">
              Log out from this device. You will need to sign in again to
              access your account.
            </p>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
