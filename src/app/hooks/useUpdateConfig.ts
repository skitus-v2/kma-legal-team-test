import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";

export const useUpdateConfig = () => {
  return useMutation({
    mutationFn: async (data: { domain: string, subdomain: string; s3Link: string; source: string; requestId?: string }) => {
      return ApiService.updateConfig(data.domain, data.subdomain, data.s3Link, data.source, data.requestId);
    },
    onSuccess: () => {
      console.log("Config updated successfully");
    },
  });
};
