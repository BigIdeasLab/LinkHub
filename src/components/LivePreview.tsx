import { ThemeSettings, Link } from "@shared/api";
import { generateGradientCSS } from "@/lib/gradient-utils";

interface LivePreviewProps {
  displayName: string;
  bio: string;
  avatarUrl?: string | null;
  links: Link[];
  theme: ThemeSettings;
}

export function LivePreview({
  displayName,
  bio,
  avatarUrl,
  links,
  theme,
}: LivePreviewProps) {
  const fontFamilyMap = {
    sans: "ui-sans-serif, system-ui, sans-serif",
    serif: "ui-serif, Georgia, serif",
    modern: "ui-monospace, Menlo, monospace",
  };

  const buttonShapeClass = {
    rounded: "rounded-lg",
    square: "rounded-none",
    pill: "rounded-full",
  };

  const buttonFillClass = {
    solid: "bg-primary text-white",
    outline: "border-2 border-primary text-primary bg-transparent",
    gradient: "bg-gradient-to-r from-primary to-secondary text-white",
  };

  const buttonShadowClass = {
    none: "",
    subtle: "shadow-md",
    prominent: "shadow-xl",
  };

  const layoutClass = {
    stacked: "flex flex-col gap-3",
    grid: "grid grid-cols-2 gap-3",
    minimal: "flex flex-col gap-2 max-w-sm",
  };

  const gradientCSS = generateGradientCSS(theme.backgroundGradient);

  return (
    <div className="w-full h-[90vh] flex items-center justify-center p-4 overflow-auto">
      {/* Phone Frame */}
      <div
        className="relative w-80 rounded-[2.5rem] bg-black p-3 shadow-2xl h-full"
        style={{ aspectRatio: "9/19.5" }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

        {/* Screen */}
        <div
          className="w-full h-full rounded-[2rem] border-8 border-black overflow-hidden flex flex-col"
          style={{
            background: gradientCSS || theme.backgroundColor,
            color: theme.textColor,
            fontFamily: fontFamilyMap[theme.fontFamily],
          }}
        >
          {/* Status Bar */}
          <div className="bg-black/5 px-4 py-2 text-xs flex justify-between items-center">
            <span>9:41</span>
            <div className="flex gap-1">
              <span>📶</span>
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="flex flex-col items-center gap-4 mb-6">
              {/* Avatar */}
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-20 h-20 rounded-full object-cover border-4"
                  style={{ borderColor: theme.primaryColor }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-4"
                  style={{ borderColor: theme.primaryColor }}
                >
                  <span className="text-2xl">👤</span>
                </div>
              )}

              {/* Name & Bio */}
              <div className="text-center">
                <h1 className="text-xl font-bold">
                  {displayName || "Your Name"}
                </h1>
                {bio && <p className="text-xs mt-2 opacity-80">{bio}</p>}
              </div>
            </div>

            {/* Links */}
            {links.length > 0 && theme.buttonStyle && (
              <div className={layoutClass[theme.layout]}>
                {links
                  .filter((link) => link.isActive)
                  .map((link) => (
                    <button
                      key={link.id}
                      className={`px-3 py-2 text-center font-medium text-xs transition ${
                        buttonShapeClass[theme.buttonStyle.shape]
                      } ${buttonFillClass[theme.buttonStyle.fill]} ${
                        buttonShadowClass[theme.buttonStyle.shadow]
                      }`}
                      style={{
                        backgroundColor:
                          theme.buttonStyle.fill === "solid"
                            ? theme.primaryColor
                            : "transparent",
                        borderColor:
                          theme.buttonStyle.fill === "outline"
                            ? theme.primaryColor
                            : "transparent",
                        color:
                          theme.buttonStyle.fill === "outline"
                            ? theme.primaryColor
                            : "white",
                      }}
                    >
                      {link.title}
                    </button>
                  ))}
              </div>
            )}

            {/* Empty State */}
            {links.length === 0 && (
              <div className="text-center py-8 opacity-50 text-sm">
                <p>No active links</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
