import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useOnboarding } from "./context";
import { useState } from "react";
import { THEME_PRESETS } from "@/lib/theme-presets";

const THEMES = [
  {
    id: "dark-mode",
    name: "Dark Mode",
    description: "Easy on the eyes",
    colors: ["#818cf8", "#f472b6"],
    bgColor: "#1e293b",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Calm and serene",
    colors: ["#0ea5e9", "#06b6d4"],
    bgColor: "#f0f9ff",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm and inviting",
    colors: ["#f97316", "#ef4444"],
    bgColor: "#fef3c7",
  },
  {
    id: "purple-dream",
    name: "Purple Dream",
    description: "Creative and bold",
    colors: ["#a78bfa", "#c084fc"],
    bgColor: "#2d1b4e",
  },
];

export default function Step4Theme() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [selectedTheme, setSelectedTheme] = useState(data.theme);

  const handleNext = () => {
    if (selectedTheme) {
      updateData({ theme: selectedTheme });
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Choose your theme</h2>
        <p className="text-foreground/70">
          You can customize colors and fonts later. For now, pick a starting
          template.
        </p>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEMES.map(({ id, name, description, colors, bgColor }) => (
          <button
            key={id}
            onClick={() => setSelectedTheme(id)}
            className={`rounded-lg border-2 overflow-hidden transition ${
              selectedTheme === id
                ? "border-primary shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
          >
            {/* Preview */}
            <div
              className="h-32 p-8 flex flex-col items-center justify-center gap-4 rounded-t-lg"
              style={{
                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
              }}
            >
              <div className="text-white text-center">
                <div className="h-8 w-8 rounded-full bg-white/30 mx-auto mb-2" />
                <div className="text-xs font-medium opacity-70">
                  Theme Preview
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2 bg-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm">{name}</h3>
                  <p className="text-xs text-foreground/60">{description}</p>
                </div>
                {selectedTheme === id && (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Skip Option */}
      <div className="rounded-lg bg-muted/50 p-4 text-center">
        <p className="text-sm text-foreground/70">
          Don't worry! You can change your theme anytime from your dashboard.
        </p>
      </div>

      {/* Validation */}
      {!selectedTheme && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Please select a theme to continue.
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
          disabled={!selectedTheme}
          className="flex-1"
        >
          Next: Profile Details
        </Button>
      </div>
    </div>
  );
}
