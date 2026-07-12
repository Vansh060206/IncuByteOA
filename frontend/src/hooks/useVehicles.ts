import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../api/axiosInstance';
import type { Vehicle, ApiResponse } from '../types';
import type { VehicleInput } from '../schemas';

export const useVehicles = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['vehicles', page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<{ vehicles: Vehicle[]; total: number }>>(
        `/vehicles?page=${page}&limit=${limit}`
      );
      return response.data.data;
    },
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useSearchVehicles = (filters: {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery({
    queryKey: ['vehicles', 'search', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.make) params.append('make', filters.make);
      if (filters.model) params.append('model', filters.model);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

      const response = await axiosInstance.get<ApiResponse<Vehicle[]>>(`/vehicles/search?${params.toString()}`);
      return response.data.data;
    },
    enabled: Object.values(filters).some((val) => val !== undefined && val !== ''),
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: VehicleInput) => {
      const response = await axiosInstance.post<ApiResponse<Vehicle>>('/vehicles', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<VehicleInput> }) => {
      const response = await axiosInstance.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data.id] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete<ApiResponse<object>>(`/vehicles/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const usePurchaseVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await axiosInstance.post<ApiResponse<any>>(`/vehicles/${id}/purchase`, { quantity });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      if (data && data.vehicleId) {
        queryClient.invalidateQueries({ queryKey: ['vehicle', data.vehicleId] });
      }
    },
  });
};

export const useRestockVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await axiosInstance.post<ApiResponse<Vehicle>>(`/vehicles/${id}/restock`, { quantity });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data.id] });
    },
  });
};
