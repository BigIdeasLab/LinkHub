"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Twitter, Instagram, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { toast } from "sonner";

export default function Preview() {
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const [copied, setCopied] = useState(false);



  if (profileLoading || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const username = profileData.username;
  const linkHubUrl = `linkhub.com/${username}`;
  const fullUrl = `https://linkhub.com/${username}`;

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
    <div className="h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-lg px-4">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center pt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <CheckCircle2 className="h-16 w-16 text-primary relative" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold">Your LinkHub is live!</h1>
            <p className="text-sm text-foreground/70">
              Your profile is now live and ready to share.
            </p>
          </div>

          {/* URL Display */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
            <p className="text-xs text-foreground/70">Your LinkHub URL:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg bg-background p-2">
                <p className="font-mono text-xs font-medium break-all">
                  {linkHubUrl}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
                className="flex-shrink-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-primary font-medium">✓ Copied!</p>
            )}
          </div>

          {/* Share Options */}
          <div className="space-y-2">
            <p className="text-xs font-medium">Share:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleShareTwitter}
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
              >
                <Twitter className="h-3 w-3" />
                Twitter
              </Button>
              <Button
                onClick={handleShareInstagram}
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
              >
                <Instagram className="h-3 w-3" />
                Instagram
              </Button>
            </div>
          </div>

          {/* Preview Link */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-center space-y-2">
            <p className="text-xs font-medium">
              Preview your LinkHub:
            </p>
            <Link
              href={`/p/${username}`}
              className="inline-block text-primary hover:underline text-sm font-medium"
            >
              View Your Page →
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 pt-2">
            <Link href={`/p/${username}`} className="flex-1">
              <Button size="sm" className="w-full text-sm">View My LinkHub</Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
