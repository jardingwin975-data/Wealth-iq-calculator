import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertCalculation } from "@shared/schema";
import { z } from "zod";

// Helper for parsing with logging
function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useCalculations() {
  return useQuery({
    queryKey: [api.calculations.list.path],
    queryFn: async () => {
      const res = await fetch(api.calculations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch calculations");
      const data = await res.json();
      return parseWithLogging(api.calculations.list.responses[200], data, "calculations.list");
    },
  });
}

export function useCreateCalculation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertCalculation) => {
      const validated = api.calculations.create.input.parse(data);
      const res = await fetch(api.calculations.create.path, {
        method: api.calculations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to save calculation");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.calculations.create.responses[201], responseData, "calculations.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calculations.list.path] });
    },
  });
}
