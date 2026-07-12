import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthResponse, ApiResponse } from '../types';
import type { LoginInput, RegisterInput } from '../schemas';
import { axiosInstance } from '../api/axiosInstance';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const decodeToken = (token: string): User | null => {
  try {
    const payloadPart = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadPart));
    return {
      id: decodedPayload.id,
      name: decodedPayload.name || 'User',
      email: decodedPayload.email,
      role: decodedPayload.role,
    };
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      if (decodedUser) {
        setToken(storedToken);
        setUser(decodedUser);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginInput) => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const { token: receivedToken, user: receivedUser } = response.data.data;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const register = async (data: RegisterInput) => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const { token: receivedToken, user: receivedUser } = response.data.data;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Ignore API errors on logout
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
