import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useRoadmapStatus() {
  return useQuery({
    queryKey: [api.roadmap.get.path],
    queryFn: async () => {
      const res = await fetch(api.roadmap.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load roadmap status");
      return api.roadmap.get.responses[200].parse(await res.json());
    },
  });
}

export function useSyncRoadmap() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.roadmap.sync.path, {
        method: api.roadmap.sync.method,
        headers: { "Content-Type": "application/json" },
        body: "{}",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to sync roadmap");
      return api.roadmap.sync.responses[200].parse(await res.json());
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: [api.roadmap.get.path] });
      queryClient.invalidateQueries({ queryKey: [api.todos.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.goals.list.path] });
      const changed = result.inserted + result.removed;
      toast({
        title: changed ? "Roadmap synced" : "Already up to date",
        description: changed
          ? `${result.inserted} tasks added, ${result.removed} removed.`
          : `All ${result.totalTasks} tasks are already there.`,
      });
    },
    onError: () => {
      toast({
        title: "Sync failed",
        description: "Could not write the plan to your task list.",
        variant: "destructive",
      });
    },
  });
}
