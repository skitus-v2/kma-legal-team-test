import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";

export const useFetchAdminDomains = (page: number, perPage: number, search: string) => {
  return useQuery({
    queryKey: ["adminDomains", page, perPage, search],
    queryFn: async () => {
      return ApiService.fetchAdminDomains(page, perPage, search);
    }
});
};
