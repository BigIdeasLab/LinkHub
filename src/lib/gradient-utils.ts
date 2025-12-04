import { BackgroundGradient } from "@shared/api";

export function generateGradientCSS(gradient: BackgroundGradient | undefined): string {
  if (!gradient || !gradient.enabled) {
    return "";
  }

  const stops = gradient.colorStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(", ");

  switch (gradient.type) {
    case "linear":
      return `linear-gradient(${gradient.angle}deg, ${stops})`;
    case "radial":
      return `radial-gradient(circle, ${stops})`;
    case "conic":
      return `conic-gradient(from 0deg, ${stops})`;
    default:
      return "";
  }
}
