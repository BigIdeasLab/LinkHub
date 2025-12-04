import { useQuery, useMutation } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/me/profile", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Failed to fetch profile");
      return await response.json();
    },
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache in garbage collector
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/me/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
  });
}

export function useCheckUsername(username: string) {
  return useQuery({
    queryKey: ["checkUsername", username],
    queryFn: async () => {
      if (!username) return { available: false };
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/me/profile/check-username?username=${username}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!response.ok) throw new Error("Failed to check username");
      return response.json();
    },
    enabled: !!username,
  });
}
