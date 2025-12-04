import { useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState({
    primaryColor: "#6366f1",
    secondaryColor: "#ec4899",
    layout: "stacked",
  });

  const updateTheme = (updates: Partial<typeof theme>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  return {
    theme,
    setTheme,
    updateTheme,
  };
}
