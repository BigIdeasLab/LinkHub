import { Button } from "@/components/ui/button";
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Download,
  Loader2,
  Instagram,
  Youtube,
  Music,
  Twitter,
  Globe,
  Mail,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-6 w-6 text-pink-600" />,
  youtube: <Youtube className="h-6 w-6 text-red-600" />,
  tiktok: <Music className="h-6 w-6 text-black" />,
  twitter: <Twitter className="h-6 w-6 text-blue-400" />,
  website: <Globe className="h-6 w-6 text-blue-600" />,
  email: <Mail className="h-6 w-6 text-gray-600" />,
  spotify: <Music className="h-6 w-6 text-green-600" />,
  discord: <MessageCircle className="h-6 w-6 text-indigo-600" />,
  custom: <LinkIcon className="h-6 w-6 text-gray-600" />,
};

export default function AnalyticsTab() {
  const { data: analyticsData, isLoading } = useAnalytics();

  const handleExport = () => {
    if (!analyticsData?.topLinks) {
      console.log("No data to export");
      return;
    }

    // Create CSV content
    const headers = ["Link Title", "Clicks"];
    const rows = analyticsData.topLinks.map((link: { title: string; clicks: number }) => [
      link.title,
      link.clicks,
    ]);
    const csvContent = [
      headers,
      ...rows,
      [],
      ["Total Clicks", analyticsData.last30Days?.clicks || 0],
      ["Total Views", analyticsData.last30Days?.views || 0],
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Download CSV
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent),
    );
    element.setAttribute("download", "analytics.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-6 space-y-2"
            >
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-8 bg-muted rounded animate-pulse" />
            </div>
          ))
        ) : (
          <>
            {/* Total Views */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground/70">
                  Total Views
                </h3>
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">
                {analyticsData?.last30Days?.views || 0}
              </p>
              <p className="text-xs text-foreground/50 mt-1">Last 30 days</p>
            </div>

            {/* Total Clicks */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground/70">
                  Total Clicks
                </h3>
                <MousePointerClick className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-3xl font-bold">
                {analyticsData?.last30Days?.clicks || 0}
              </p>
              <p className="text-xs text-foreground/50 mt-1">Last 30 days</p>
            </div>

            {/* CTR */}
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-foreground/70">
                  Click-Through Rate
                </h3>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold">
                {analyticsData?.last30Days?.views
                  ? (
                      ((analyticsData.last30Days?.clicks || 0) /
                        analyticsData.last30Days.views) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
              <p className="text-xs text-foreground/50 mt-1">Last 30 days</p>
            </div>
          </>
        )}
      </div>

      {/* Top Links */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Top Performing Links</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export
          </Button>
        </div>

        <div className="space-y-2">
          {analyticsData?.topLinks && analyticsData.topLinks.length > 0 ? (
            analyticsData.topLinks.map((link: { id: string; title: string; platform: string; clicks: number }, index: number) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                    {PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.custom}
                  </div>
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-xs text-foreground/70">
                      {link.clicks} clicks
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {analyticsData.last30Days?.clicks > 0
                      ? (
                          (link.clicks / analyticsData.last30Days.clicks) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-foreground/70">
              <p>No links clicked yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="font-semibold">Views & Clicks Over Time</h3>
        <div className="h-80 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-foreground/70">📊 Chart visualization</p>
            <p className="text-sm text-foreground/50">
              Interactive charts coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
