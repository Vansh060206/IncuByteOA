import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  year: number;
  color: string;
  licensePlate: string;
  userId: string;
}

const API_URL = 'http://localhost:5000/api/v1';

export const useVehicles = () => {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/vehicles`, {
        headers: getHeaders(),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch vehicles');
      }
      setVehicles(result.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const searchVehicles = useCallback(async (filters: {
    make?: string;
    model?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.make) queryParams.append('make', filters.make);
      if (filters.model) queryParams.append('model', filters.model);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const response = await fetch(`${API_URL}/vehicles/search?${queryParams.toString()}`, {
        headers: getHeaders(),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Search failed');
      }
      setVehicles(result.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'userId'>) => {
    setError(null);
    const response = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vehicleData),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to create vehicle');
    }
    setVehicles((prev) => [result.data, ...prev]);
    return result.data;
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Omit<Vehicle, 'id' | 'userId'>>) => {
    setError(null);
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(vehicleData),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to update vehicle');
    }
    setVehicles((prev) => prev.map((v) => (v.id === id ? result.data : v)));
    return result.data;
  };

  const deleteVehicle = async (id: string) => {
    setError(null);
    const response = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to delete vehicle');
    }
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const purchaseVehicle = async (id: string) => {
    setError(null);
    const response = await fetch(`${API_URL}/vehicles/${id}/purchase`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to purchase vehicle');
    }
    setVehicles((prev) => prev.map((v) => (v.id === id ? result.data : v)));
    return result.data;
  };

  const restockVehicle = async (id: string, quantity: number) => {
    setError(null);
    const response = await fetch(`${API_URL}/vehicles/${id}/restock`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to restock vehicle');
    }
    setVehicles((prev) => prev.map((v) => (v.id === id ? result.data : v)));
    return result.data;
  };

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    searchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    purchaseVehicle,
    restockVehicle,
  };
};
