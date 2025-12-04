import { useQuery } from "@tanstack/react-query";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/me/analytics", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });
}
