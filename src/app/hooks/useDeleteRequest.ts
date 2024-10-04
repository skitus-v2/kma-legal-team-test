import { useMutation } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';

export const useDeleteRequest = () => {
  return useMutation({
    mutationFn: ({ requestId, fileName }: { requestId: string, fileName: string }) => {
      return ApiService.deleteRequest(requestId, fileName);
    },
  });
};
