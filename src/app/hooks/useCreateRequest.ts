import { useMutation } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';

export const useCreateRequest = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return ApiService.createRequest(formData);
    },
  });
};
