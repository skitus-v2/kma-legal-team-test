import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../services/apiService";

export const useFetchFiles = () => {
  return useQuery({
    queryKey: ["files"],
    queryFn: async () => {
        return ApiService.getFiles()
    }});
};