/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// ========== Auth Types ==========
export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  token: string;
  onboarded?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  token: string;
  onboarded?: boolean;
}

// ========== Profile Types ==========
export interface ProfileResponse {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  theme: string;
  customDomain: string | null;
  plan: "free" | "pro" | "business";
  createdAt: string;
  updatedAt: string;
}

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface BackgroundGradient {
  enabled: boolean;
  type: "linear" | "radial" | "conic";
  angle: number; // 0-360, for linear gradients
  colorStops: GradientStop[];
}

export interface ThemeSettings {
  layout: "stacked" | "grid" | "minimal";
  primaryColor: string; // hex color
  secondaryColor: string;
  backgroundColor: string;
  backgroundGradient?: BackgroundGradient;
  textColor: string;
  fontFamily: "sans" | "serif" | "modern";
  buttonStyle: {
    shape: "rounded" | "square" | "pill";
    fill: "solid" | "outline" | "gradient";
    shadow: "none" | "subtle" | "prominent";
  };
}

export interface UpdateProfileRequest {
  username?: string;
  displayName?: string;
  bio?: string;
  theme?: ThemeSettings;
  avatarUrl?: string;
}

export interface CheckUsernameRequest {
  username: string;
}

export interface CheckUsernameResponse {
  available: boolean;
  suggestions?: string[];
}

// ========== Link Types ==========
export interface Link {
  id: string;
  profileId: string;
  title: string;
  url: string;
  iconType: "platform" | "custom";
  platform: string;
  customIconUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkRequest {
  title: string;
  url: string;
  platform: string;
}

export interface UpdateLinkRequest {
  title?: string;
  url?: string;
  platform?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface LinkClickEvent {
  linkId: string;
}

// ========== Analytics Types ==========
export interface AnalyticsOverviewResponse {
  today: {
    views: number;
    clicks: number;
    ctr: number; // click-through rate
  };
  last7Days: {
    views: number;
    clicks: number;
  };
  last30Days: {
    views: number;
    clicks: number;
  };
  topLinks: Array<{
    id: string;
    title: string;
    clicks: number;
    platform: string;
  }>;
}

export interface PageViewEvent {
  userAgent: string;
  referrer: string | null;
}

// ========== Error Response ==========
export interface ErrorResponse {
  message: string;
  code: string;
}

// ========== Demo Response (for testing) ==========
export interface DemoResponse {
  message: string;
}
