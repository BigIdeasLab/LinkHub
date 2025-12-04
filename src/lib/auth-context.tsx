import React, { createContext, useContext, useState, useEffect } from "react";
import { SignupResponse, LoginResponse } from "@shared/api";

interface AuthContextType {
  user: (SignupResponse & { onboarded?: boolean }) | null;
  isLoading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SignupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    console.log("[Auth] Init - storedUser:", !!storedUser, "storedToken:", !!storedToken);
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("[Auth] Parsed user:", parsedUser);
        setUser(parsedUser);
        setIsLoading(false);
        
        // Fetch fresh profile data to get onboarded status in background (don't block on it)
        fetch("/api/me/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        })
          .then(res => {
            if (!res.ok) {
              console.warn("Profile fetch returned non-ok status:", res.status);
              return null;
            }
            return res.json();
          })
          .then(profile => {
            if (profile) {
              setUser(prev => prev ? { ...prev, onboarded: profile.onboarded } : null);
            }
          })
          .catch(err => {
            console.warn("Failed to fetch profile (non-critical):", err);
            // Don't clear user on profile fetch failure - token might still be valid
          });
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Signup failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const data: SignupResponse = await response.json();
      localStorage.setItem("token", data.token);

      // Fetch profile to get onboarded status
      const profileResponse = await fetch("/api/me/profile", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      let userWithOnboarded = { ...data, onboarded: false };
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        userWithOnboarded.onboarded = profile.onboarded || false;
      }

      setUser(userWithOnboarded);
      localStorage.setItem("user", JSON.stringify(userWithOnboarded));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();
      localStorage.setItem("token", data.token);

      // Fetch profile to get onboarded status
      const profileResponse = await fetch("/api/me/profile", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      let userWithOnboarded = { ...data, onboarded: false };
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        userWithOnboarded.onboarded = profile.onboarded || false;
      }

      setUser(userWithOnboarded);
      localStorage.setItem("user", JSON.stringify(userWithOnboarded));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const profileResponse = await fetch("/api/me/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        if (user) {
          const updatedUser = { ...user, onboarded: profile.onboarded };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, signup, login, logout, clearError, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
