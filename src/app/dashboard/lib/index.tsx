import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Link as LinkIcon,
  Palette,
  Settings,
  ArrowRight,
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import LinksTab from "./LinksTab";
import AppearanceTab from "./AppearanceTab";
import SettingsTab from "./SettingsTab";
import AnalyticsTab from "./AnalyticsTab";

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useProfile();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted/30 to-background py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/70">
              Manage your LinkHub profile, links, and analytics.
            </p>
          </div>
          {profile?.username && (
            <Link href={`/p/${profile.username}`} target="_blank">
              <Button className="gap-2">
                <LinkIcon className="h-4 w-4" />
                View LinkHub
              </Button>
            </Link>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="links" className="gap-2">
              <LinkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Links</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Links Tab */}
          <TabsContent value="links" className="space-y-6">
            <LinksTab />
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <AppearanceTab />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsTab />
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h2 className="font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profileLoading ? (
              <Button variant="ghost" disabled className="w-full">
                Loading...
              </Button>
            ) : profile?.username ? (
              <Link href={`/p/${profile.username}`}>
                <Button variant="ghost" className="w-full justify-between">
                  View Your LinkHub
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}
            <Link href="/">
              <Button variant="ghost" className="w-full justify-between">
                View Help & Guides
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
