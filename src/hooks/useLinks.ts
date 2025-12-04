import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useLinks() {
  const queryClient = useQueryClient();

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      const response = await fetch("/api/me/links", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch links");
      return response.json();
    },
  });

  const fetchLinks = async () => {
    const response = await fetch("/api/me/links", {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch links");
    return response.json();
  };

  const createLink = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/me/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create link");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  const updateLink = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/me/links/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update link");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/me/links/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete link");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  return {
    links,
    isLoading,
    fetchLinks,
    createLink,
    updateLink,
    deleteLink,
  };
}
