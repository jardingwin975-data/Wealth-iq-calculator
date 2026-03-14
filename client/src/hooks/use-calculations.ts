import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Calculation = {
  id: number;
  income: number;
  rent: number;
  carPayment: number;
  groceries: number;
  otherExpenses: number;
  score: number;
};

export type InsertCalculation = Omit<Calculation, "id">;

const STORAGE_KEY = "wealth-iq-calculations";
const QUERY_KEY = ["wealth-iq-calculations"];

function getStoredCalculations(): Calculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStoredCalculations(calculations: Calculation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calculations));
}

export function useCalculations() {
  return useQuery<Calculation[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => getStoredCalculations(),
    staleTime: Infinity,
  });
}

export function useCreateCalculation() {
  const queryClient = useQueryClient();

  return useMutation<Calculation, Error, InsertCalculation>({
    mutationFn: async (data) => {
      const existing = getStoredCalculations();

      const next: Calculation = {
        ...data,
        id: Date.now(),
      };

      const updated = [next, ...existing];
      setStoredCalculations(updated);
      return next;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useClearCalculations() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      localStorage.removeItem(STORAGE_KEY);
    },
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEY, []);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
