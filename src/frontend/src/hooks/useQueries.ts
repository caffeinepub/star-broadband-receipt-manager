import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Receipt } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useGetAllReceipts() {
  const { actor, isFetching } = useActor();
  return useQuery<Receipt[]>({
    queryKey: ["receipts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReceiptsDesc();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNextReceiptNo() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["nextReceiptNo"],
    queryFn: async () => {
      if (!actor) return BigInt(1);
      return actor.getNextReceiptNo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReceipt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (receipt: Receipt) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createReceipt(receipt);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["receipts"] });
      void queryClient.invalidateQueries({ queryKey: ["nextReceiptNo"] });
    },
  });
}

export function useUpdateReceipt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, receipt }: { id: bigint; receipt: Receipt }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateReceipt(id, receipt);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
  });
}

export function useDeleteReceipt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteReceipt(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
  });
}
