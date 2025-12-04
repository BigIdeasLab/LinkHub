import { useEffect, useState } from "react";
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
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import { useLinks } from "@/hooks/useLinks";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { LivePreview } from "@/components/LivePreview";
import { ThemeSettings } from "@shared/api";
import { THEME_PRESETS } from "@/lib/theme-presets";

export default function AppearanceTab() {
  const { updateTheme: saveTheme } = useTheme();
  const { links } = useLinks();
  const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize with profile data when it loads
  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || "Your Name");
      setBio(profileData.bio || "Welcome to my LinkHub");
      setAvatarUrl(profileData.avatarUrl || null);
      if (profileData.theme) {
        const parsedTheme = typeof profileData.theme === "string" 
          ? JSON.parse(profileData.theme) 
          : profileData.theme;
        setTheme(parsedTheme);
      }
    }
  }, [profileData]);

  // Track if there are unsaved changes
  const hasChanges = theme && profileData?.theme ? 
    JSON.stringify(theme) !== JSON.stringify(typeof profileData.theme === "string" ? JSON.parse(profileData.theme) : profileData.theme) 
    : false;

  // Local update functions (no server call)
  const updateColor = (
    key: "primaryColor" | "secondaryColor" | "backgroundColor" | "textColor",
    value: string,
  ) => {
    if (theme) {
      setTheme({ ...theme, [key]: value });
    }
  };

  const updateButtonStyle = (key: string, value: string) => {
    if (theme) {
      setTheme({
        ...theme,
        buttonStyle: {
          ...theme.buttonStyle,
          [key]: value,
        } as any,
      });
    }
  };

  const updateThemeLocal = (updates: Partial<ThemeSettings>) => {
    if (theme) {
      setTheme({ ...theme, ...updates });
    }
  };

  const updateGradient = (
    updates: Partial<import("@shared/api").BackgroundGradient>,
  ) => {
    if (theme) {
      setTheme({
        ...theme,
        backgroundGradient: {
          ...theme.backgroundGradient,
          ...updates,
        } as any,
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      if (theme) {
        await updateProfile({ theme });
        await refetchProfile();
        toast.success("Theme saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save theme:", error);
      toast.error("Failed to save theme. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const layouts: Array<ThemeSettings["layout"]> = [
    "stacked",
    "grid",
    "minimal",
  ];
  const fontFamilies: Array<ThemeSettings["fontFamily"]> = [
    "sans",
    "serif",
    "modern",
  ];
  const buttonShapes: Array<ThemeSettings["buttonStyle"]["shape"]> = [
    "rounded",
    "square",
    "pill",
  ];
  const buttonFills: Array<ThemeSettings["buttonStyle"]["fill"]> = [
    "solid",
    "outline",
    "gradient",
  ];
  const buttonShadows: Array<ThemeSettings["buttonStyle"]["shadow"]> = [
    "none",
    "subtle",
    "prominent",
  ];

  // Show loading state while theme is loading
  if (!theme) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Settings Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Save Changes Button */}
        {hasChanges && (
          <div className="rounded-lg border border-primary/50 bg-primary/5 p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">You have unsaved changes</p>
              <p className="text-xs text-foreground/70">
                Click save to apply your theme changes
              </p>
            </div>
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving || profileLoading}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}

        {/* Theme Presets */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Theme Presets</h3>
            <p className="text-sm text-foreground/70 mb-3">
              Choose a preset to get started
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {THEME_PRESETS.map((preset) => {
              const isSelected =
                theme.primaryColor === preset.theme.primaryColor &&
                theme.layout === preset.theme.layout;
              return (
                <button
                  key={preset.name}
                  onClick={() => updateThemeLocal(preset.theme)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm">{preset.name}</div>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-xs text-foreground/70">
                    {preset.description}
                  </p>
                  <div className="flex gap-1 mt-3">
                    <div
                      className="h-6 w-6 rounded border border-border"
                      style={{ backgroundColor: preset.theme.primaryColor }}
                    />
                    <div
                      className="h-6 w-6 rounded border border-border"
                      style={{ backgroundColor: preset.theme.secondaryColor }}
                    />
                    <div
                      className="h-6 w-6 rounded border border-border"
                      style={{ backgroundColor: preset.theme.backgroundColor }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* Layout */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Layout</h3>
            <p className="text-sm text-foreground/70 mb-3">
              Choose how your links are displayed
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {layouts.map((layout) => (
              <button
                key={layout}
                onClick={() => updateThemeLocal({ layout })}
                className={`px-4 py-2 rounded-lg border-2 transition ${
                  theme.layout === layout
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-xs font-medium capitalize">{layout}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Colors</h3>
            <p className="text-sm text-foreground/70 mb-3">
              Customize your brand colors
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Primary Color */}
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <input
                  id="primary-color"
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => updateColor("primaryColor", e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border border-border"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => updateColor("primaryColor", e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <input
                  id="secondary-color"
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    updateColor("secondaryColor", e.target.value)
                  }
                  className="h-10 w-14 cursor-pointer rounded border border-border"
                />
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    updateColor("secondaryColor", e.target.value)
                  }
                  placeholder="#ec4899"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex gap-2">
                <input
                  id="bg-color"
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    updateColor("backgroundColor", e.target.value)
                  }
                  className="h-10 w-14 cursor-pointer rounded border border-border"
                />
                <Input
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    updateColor("backgroundColor", e.target.value)
                  }
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex gap-2">
                <input
                  id="text-color"
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => updateColor("textColor", e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border border-border"
                />
                <Input
                  value={theme.textColor}
                  onChange={(e) => updateColor("textColor", e.target.value)}
                  placeholder="#0f172a"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Background */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Background Gradient</h3>
            <p className="text-sm text-foreground/70 mb-3">
              Add a gradient overlay to your background
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="gradient-enabled"
              checked={theme.backgroundGradient?.enabled || false}
              onChange={(e) => updateGradient({ enabled: e.target.checked })}
              className="h-4 w-4 cursor-pointer"
            />
            <label
              htmlFor="gradient-enabled"
              className="text-sm font-medium cursor-pointer"
            >
              Enable gradient background
            </label>
          </div>

          {theme.backgroundGradient?.enabled && (
            <>
              {/* Gradient Type */}
              <div className="space-y-2">
                <Label>Gradient Type</Label>
                <div className="grid grid-cols-3 gap-3">
                  {["linear", "radial", "conic"].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        updateGradient({
                          type: type as "linear" | "radial" | "conic",
                        })
                      }
                      className={`px-4 py-2 rounded-lg border-2 transition text-sm ${
                        theme.backgroundGradient?.type === type
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Angle Slider (for linear gradients only) */}
              {theme.backgroundGradient?.type === "linear" && (
                <div className="space-y-2">
                  <Label className="flex items-center justify-between">
                    <span>Gradient Angle</span>
                    <span className="text-sm text-primary">
                      {theme.backgroundGradient?.angle}°
                    </span>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={theme.backgroundGradient?.angle || 45}
                    onChange={(e) =>
                      updateGradient({ angle: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              )}

              {/* Color Stops */}
              <div className="space-y-3">
                <Label>Color Stops</Label>
                {theme.backgroundGradient?.colorStops?.map((stop, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">
                        Stop {index + 1} ({stop.position}%)
                      </Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => {
                            const newStops =
                              theme.backgroundGradient?.colorStops || [];
                            newStops[index] = {
                              ...newStops[index],
                              color: e.target.value,
                            };
                            updateGradient({ colorStops: newStops });
                          }}
                          className="h-10 w-14 cursor-pointer rounded border border-border"
                        />
                        <Input
                          value={stop.color}
                          onChange={(e) => {
                            const newStops =
                              theme.backgroundGradient?.colorStops || [];
                            newStops[index] = {
                              ...newStops[index],
                              color: e.target.value,
                            };
                            updateGradient({ colorStops: newStops });
                          }}
                          placeholder="#000000"
                          className="flex-1 text-xs"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) => {
                        const newStops =
                          theme.backgroundGradient?.colorStops || [];
                        newStops[index] = {
                          ...newStops[index],
                          position: parseInt(e.target.value),
                        };
                        updateGradient({ colorStops: newStops });
                      }}
                      className="w-20"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Typography */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Typography</h3>
            <p className="text-sm text-foreground/70 mb-3">
              Choose your font family
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {fontFamilies.map((font) => (
              <button
                key={font}
                onClick={() => updateThemeLocal({ fontFamily: font })}
                className={`px-4 py-2 rounded-lg border-2 transition ${
                  theme.fontFamily === font
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-xs font-medium capitalize">{font}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Button Styles */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Button Styles</h3>
            <p className="text-sm text-foreground/70 mb-3">
              Customize how your buttons look
            </p>
          </div>

          {/* Shape */}
          {theme && theme.buttonStyle && (
            <div>
              <Label className="text-sm mb-2 block">Shape</Label>
              <div className="grid grid-cols-3 gap-3">
                {buttonShapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => updateButtonStyle("shape", shape)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      theme.buttonStyle.shape === shape
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs font-medium capitalize">{shape}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fill */}
          {theme && theme.buttonStyle && (
            <div>
              <Label className="text-sm mb-2 block">Fill</Label>
              <div className="grid grid-cols-3 gap-3">
                {buttonFills.map((fill) => (
                  <button
                    key={fill}
                    onClick={() => updateButtonStyle("fill", fill)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      theme.buttonStyle.fill === fill
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs font-medium capitalize">{fill}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shadow */}
          {theme && theme.buttonStyle && (
            <div>
              <Label className="text-sm mb-2 block">Shadow</Label>
              <div className="grid grid-cols-3 gap-3">
                {buttonShadows.map((shadow) => (
                  <button
                    key={shadow}
                    onClick={() => updateButtonStyle("shadow", shadow)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      theme.buttonStyle.shadow === shadow
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs font-medium capitalize">{shadow}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 space-y-4">
          <h3 className="font-semibold">Live Preview</h3>
          {profileLoading || !theme ? (
            <div className="rounded-lg border border-border bg-card p-8 flex items-center justify-center gap-3 h-[90vh]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden h-[90vh] shadow-lg">
              <LivePreview
                displayName={displayName}
                bio={bio}
                avatarUrl={avatarUrl}
                links={links}
                theme={theme}
              />
            </div>
          )}
          <p className="text-xs text-foreground/70">
            Preview updates automatically as you customize
          </p>
        </div>
      </div>
    </div>
  );
}
