import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";

export const useFetchRequests = () => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
        return ApiService.getRequests()
    }});
};