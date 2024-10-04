import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';

export const useFetchLawyerDomains = (page: number, limit: number, search: string | null) => {
  return useQuery({
    queryKey: ['domains', page, limit, search],
    queryFn: async () => {
      return ApiService.getDomains(page, limit, search);
    }
  });
};
