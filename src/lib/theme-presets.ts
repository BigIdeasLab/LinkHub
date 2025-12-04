import { ThemeSettings } from "@shared/api";

export interface ThemePreset {
  name: string;
  description: string;
  theme: ThemeSettings;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Classic Light",
    description: "Clean and professional",
    theme: {
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
    },
  },
  {
    name: "Dark Mode",
    description: "Easy on the eyes",
    theme: {
      layout: "stacked",
      primaryColor: "#818cf8",
      secondaryColor: "#f472b6",
      backgroundColor: "#1e293b",
      textColor: "#f1f5f9",
      fontFamily: "sans",
      buttonStyle: {
        shape: "rounded",
        fill: "solid",
        shadow: "subtle",
      },
    },
  },
  {
    name: "Neon Vibes",
    description: "Bold and modern",
    theme: {
      layout: "grid",
      primaryColor: "#00ff00",
      secondaryColor: "#ff00ff",
      backgroundColor: "#0a0e27",
      textColor: "#ffffff",
      fontFamily: "modern",
      buttonStyle: {
        shape: "pill",
        fill: "solid",
        shadow: "prominent",
      },
    },
  },
  {
    name: "Ocean Blue",
    description: "Calm and serene",
    theme: {
      layout: "stacked",
      primaryColor: "#0ea5e9",
      secondaryColor: "#06b6d4",
      backgroundColor: "#f0f9ff",
      textColor: "#0c4a6e",
      fontFamily: "sans",
      buttonStyle: {
        shape: "rounded",
        fill: "outline",
        shadow: "subtle",
      },
    },
  },
  {
    name: "Sunset",
    description: "Warm and inviting",
    theme: {
      layout: "grid",
      primaryColor: "#f97316",
      secondaryColor: "#ef4444",
      backgroundColor: "#fef3c7",
      textColor: "#78350f",
      fontFamily: "serif",
      buttonStyle: {
        shape: "rounded",
        fill: "solid",
        shadow: "subtle",
      },
    },
  },
  {
    name: "Minimal",
    description: "Simple and elegant",
    theme: {
      layout: "minimal",
      primaryColor: "#000000",
      secondaryColor: "#808080",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      fontFamily: "sans",
      buttonStyle: {
        shape: "square",
        fill: "outline",
        shadow: "none",
      },
    },
  },
  {
    name: "Purple Dream",
    description: "Creative and bold",
    theme: {
      layout: "grid",
      primaryColor: "#a78bfa",
      secondaryColor: "#c084fc",
      backgroundColor: "#2d1b4e",
      textColor: "#f3e8ff",
      fontFamily: "modern",
      buttonStyle: {
        shape: "pill",
        fill: "gradient",
        shadow: "subtle",
      },
    },
  },
  {
    name: "Fresh Green",
    description: "Natural and organic",
    theme: {
      layout: "stacked",
      primaryColor: "#10b981",
      secondaryColor: "#34d399",
      backgroundColor: "#ecfdf5",
      textColor: "#064e3b",
      fontFamily: "sans",
      buttonStyle: {
        shape: "rounded",
        fill: "solid",
        shadow: "subtle",
      },
    },
  },
];
