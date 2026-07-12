import { http, HttpResponse } from 'msw';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api/v1';

export const handlers = [
  http.post(`${API_BASE_URL}/auth/login`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token',
        user: {
          id: 'user-id',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'USER',
        },
      },
    });
  }),

  http.post(`${API_BASE_URL}/auth/register`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        token: 'mock-jwt-token',
        user: {
          id: 'user-id',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'USER',
        },
      },
    });
  }),

  http.get(`${API_BASE_URL}/vehicles`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: {
        vehicles: [
          {
            id: 'vehicle-1',
            make: 'Toyota',
            model: 'Corolla',
            category: 'Sedan',
            price: 22000,
            quantity: 5,
            createdAt: '2026-07-10T00:00:00Z',
            updatedAt: '2026-07-10T00:00:00Z',
          },
          {
            id: 'vehicle-2',
            make: 'Honda',
            model: 'Civic',
            category: 'Sedan',
            price: 24000,
            quantity: 0,
            createdAt: '2026-07-10T00:00:00Z',
            updatedAt: '2026-07-10T00:00:00Z',
          },
        ],
        total: 2,
      },
    });
  }),

  http.post(`${API_BASE_URL}/vehicles/:id/purchase`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Vehicle purchased successfully',
      data: {
        vehicleId: 'vehicle-1',
        quantity: 1,
      },
    });
  }),
];
