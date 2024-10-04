import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';

// Fetch subdomains for a specific domain ID
export const useFetchLawyerSubdomains = (domainId: number | null) => {
  return useQuery({
    queryKey: ['subdomains', domainId],
    queryFn: async () => {
      if (!domainId) return [];
      return ApiService.getSubdomainsByDomainId(domainId);
    },
    enabled: !!domainId, // Fetch only when domainId is set
  });
};
