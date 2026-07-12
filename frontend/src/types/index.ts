export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: string | number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseHistory {
  id: string;
  userId: string;
  vehicleId: string;
  quantity: number;
  purchaseDate: string;
  vehicle?: Vehicle;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors: { field?: string; message: string }[];
}
