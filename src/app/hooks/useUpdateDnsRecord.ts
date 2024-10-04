import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";

export const useUpdateDnsRecord = (zoneId: string) => {
  return useMutation({
    mutationFn: async ({ recordId, record }: { recordId: string; record: { type: string; name: string; content: string; proxied: boolean } }) => {
      return ApiService.updateDnsRecord(zoneId, recordId, record);
    }
  });
};
