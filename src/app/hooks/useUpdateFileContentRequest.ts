import { useMutation } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';

export const useUpdateFileContent = () => {
  return useMutation({
    mutationFn: ({ fileName, formData }: { fileName: string, formData: FormData }) => {
      return ApiService.updateFileContent(fileName, formData);
    },
  });
};
