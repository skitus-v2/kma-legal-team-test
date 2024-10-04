import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';

// Fetch files for a specific subdomain ID
export const useFetchLawyerFiles = (subdomainId: number | null) => {
  return useQuery({
    queryKey: ['files', subdomainId],
    queryFn: async () => {
      if (!subdomainId) return [];
      return ApiService.getFilesBySubdomainId(subdomainId);
    },
    enabled: !!subdomainId // Only fetch if subdomainId is not null
  });
};
