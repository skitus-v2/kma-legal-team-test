import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API;

export const ApiService = {
  async getDomains(page: number, limit: number, search: string | null) {
    try {
      const params = {
        page,
        limit,
        ...(search ? { search } : {}),
      };
      const { data } = await axios.get(`${API_URL}/lawyer/domains`, { params });
      
      return {
        domains: data.data.data,
        total: data.data.total,
      };
    } catch (error) {
      toast.error('Failed to fetch domains.');
      throw error;
    }
  },

  async getSubdomainsByDomainId(domainId: number) {
    try {
      const response = await axios.get(`${API_URL}/lawyer/domains/${domainId}/subdomains`);
      return response.data.data;
    } catch (error) {
      toast.error('Failed to fetch subdomains.');
      throw error;
    }
  },

  async getFilesBySubdomainId(subdomainId: number) {
    try {
      const response = await axios.get(`${API_URL}/lawyer/subdomains/${subdomainId}/files`);
      return response.data.data;
    } catch (error) {
      toast.error('Failed to fetch files.');
      throw error;
    }
  },

  async sendSlackNotification(mainMessage: string, additionalMessage: string, fileName: string) {
    try {
      return await axios.post(`${API_URL}/slack/notification`, {
        mainMessage,
        additionalMessage,
        fileName,
      });
    } catch (error) {
      toast.error('Failed to send Slack notification.');
      throw error;
    }
  },

  async updateFileContent(fileName: string, formData: FormData) {
    try {
      const response = await axios.put(`${API_URL}/files/${fileName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to update file content.');
      throw error;
    }
  },

  async getRequests() {
    try {
      const response = await axios.get(`${API_URL}/lawyer/requests`);
      return response.data.data;
    } catch (error) {
      toast.error('Failed to fetch requests.');
      throw error;
    }
  },

  async getFiles() {
    try {
      const response = await axios.get(`${API_URL}/files`);
      return response.data.files;
    } catch (error) {
      toast.error('Failed to fetch files.');
      throw error;
    }
  },

  async deleteRequest(requestId: string, fileName: string) {
    try {
      return await axios.delete(`${API_URL}/lawyer/requests/${requestId}`, {
        params: { fileName },
      });
    } catch (error) {
      toast.error('Failed to delete request.');
      throw error;
    }
  },

  async createRequest(formData: FormData) {
    try {
      const response = await axios.post(`${API_URL}/lawyer/requests`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to create request.');
      throw error;
    }
  },

  async fetchAdminDomains(page: number = 1, perPage: number = 500, search: string = '') {
    try {
      const params = {
        page,
        per_page: perPage,
        name: search,
      };
      const response = await axios.get(`${API_URL}/admin/domains`, { params });
      return response.data.domains;
    } catch (error) {
      toast.error('Failed to fetch admin domains.');
      throw error;
    }
  },

  async getSubdomainsByDomainIdCF(domainId: string) {
    try {
      const response = await axios.get(`${API_URL}/admin/domains/${domainId}/subdomains`);
      return response.data.subdomains;
    } catch (error) {
      toast.error('Failed to fetch subdomains for admin.');
      throw error;
    }
  },

  async createDnsRecord(zoneId: string, record: { type: string; name: string; content: string; proxied: boolean }) {
    try {
      const response = await axios.post(`${API_URL}/admin/zones/${zoneId}/dns_records`, record);
      return response.data;
    } catch (error) {
      toast.error('Failed to create DNS record.');
      throw error;
    }
  },

  async updateDnsRecord(zoneId: string, recordId: string, record: { type: string; name: string; content: string; proxied: boolean }) {
    try {
      const response = await axios.put(`${API_URL}/admin/zones/${zoneId}/dns_records/${recordId}`, record);
      return response.data;
    } catch (error) {
      toast.error('Failed to update DNS record.');
      throw error;
    }
  },

  async deleteDnsRecord(zoneId: string, recordId: string) {
    try {
      const response = await axios.delete(`${API_URL}/admin/zones/${zoneId}/dns_records/${recordId}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to delete DNS record.');
      throw error;
    }
  },

  async updateConfig(domain: string, subdomain: string, s3Link: string, source: string, requestId?: string) {
    try {
      const response = await axios.post(`${API_URL}/update-config`, {
        domain,
        subdomain,
        s3Link,
        source,
        requestId,
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to update configuration.');
      throw error;
    }
  },
};
