import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";

export const useCreateDnsRecord = (zoneId: string) => {
  return useMutation({
    mutationFn: async (record: { type: string; name: string; content: string; proxied: boolean }) => {
      return ApiService.createDnsRecord(zoneId, record);
    }
  });
};
