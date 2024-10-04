import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";

export const useDeleteDnsRecord = (zoneId: string) => {
  return useMutation({
    mutationFn: async (recordId: string) => {
      return ApiService.deleteDnsRecord(zoneId, recordId);
    }
  });
};
