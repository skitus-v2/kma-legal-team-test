import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";

export const useFetchDnsRecords = (domainId: string) => {
  return useQuery({
    queryKey: ["dnsRecords", domainId],
    queryFn: async () => {
      if (!domainId) return [];
      return ApiService.getSubdomainsByDomainIdCF(domainId);
    },
  });
};
