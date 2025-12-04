import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Plus,
  X,
  GripVertical,
  Instagram,
  Youtube,
  Music,
  Twitter,
  Globe,
  Mail,
  Music2,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import { useOnboarding } from "./context";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", Icon: Instagram },
  { id: "youtube", label: "YouTube", Icon: Youtube },
  { id: "tiktok", label: "TikTok", Icon: Music },
  { id: "twitter", label: "Twitter", Icon: Twitter },
  { id: "website", label: "Website", Icon: Globe },
  { id: "email", label: "Email", Icon: Mail },
  { id: "spotify", label: "Spotify", Icon: Music2 },
  { id: "discord", label: "Discord", Icon: MessageCircle },
  { id: "custom", label: "Custom Link", Icon: LinkIcon },
];

interface Link {
  id: string;
  platform: string;
  title: string;
  url: string;
}

export default function Step3Links() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [links, setLinks] = useState<Link[]>(data.links);
  const [newLink, setNewLink] = useState({ platform: "instagram", url: "" });
  const [urlError, setUrlError] = useState<string | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddLink = () => {
    const url = newLink.url.trim();
    
    if (!url) {
      setUrlError("URL is required");
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setUrlError(null);

    const platformLabel =
      PLATFORMS.find((p) => p.id === newLink.platform)?.label ||
      newLink.platform;

    const link: Link = {
      id: Math.random().toString(36).substr(2, 9),
      platform: newLink.platform,
      title: platformLabel,
      url: newLink.url,
    };

    setLinks([...links, link]);
    setNewLink({ platform: "instagram", url: "" });
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleNext = () => {
    if (links.length > 0) {
      updateData({ links });
      nextStep();
    }
  };

  const platformLabel = PLATFORMS.find((p) => p.id === newLink.platform)?.label;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Add your first links</h2>
        <p className="text-foreground/70">
          Start with at least one link. You can add more anytime.
        </p>
      </div>

      {/* Current Links */}
      {links.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Your links ({links.length})</h3>
          <div className="space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{link.title}</p>
                  <p className="text-xs text-foreground/60 truncate">
                    {link.url}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveLink(link.id)}
                  className="p-1 hover:bg-muted rounded transition flex-shrink-0"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Link Form */}
      <div className="rounded-lg border border-border bg-muted/30 p-6 space-y-4">
        <h3 className="font-semibold text-sm">Add another link</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Platform Select */}
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm">
              Platform
            </Label>
            <Select
              value={newLink.platform}
              onValueChange={(value) =>
                setNewLink({ ...newLink, platform: value })
              }
            >
              <SelectTrigger id="platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(({ id, label, Icon }) => (
                  <SelectItem key={id} value={id}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm">
              URL
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              value={newLink.url}
              onChange={(e) => {
                setNewLink({ ...newLink, url: e.target.value });
                setUrlError(null);
              }}
              className={urlError ? "border-destructive" : ""}
            />
            {urlError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {urlError}
              </p>
            )}
          </div>
          </div>

        {/* Add Button */}
        <Button
          type="button"
          onClick={handleAddLink}
          disabled={!newLink.url.trim()}
          variant="secondary"
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {platformLabel}
        </Button>
      </div>

      {/* Progress Message */}
      {links.length > 0 && (
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm text-primary">
          Great start! Add 2 more links for best results.
        </div>
      )}

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
          disabled={links.length === 0}
          className="flex-1"
        >
          Next: Choose Theme
        </Button>
      </div>
    </div>
  );
}
