import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './layouts/Layout';
import { ProtectedRoute, AdminRoute } from './routes';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VehicleDetails } from './pages/VehicleDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { InventoryPage } from './pages/InventoryPage';
import { PurchasesPage } from './pages/PurchasesPage';
import { ActivityPage } from './pages/ActivityPage';
import { NotFound } from './pages/NotFound';
import { LandingPageOrDashboard } from './pages/LandingPageOrDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<LandingPageOrDashboard />} />

              {/* Protected Routes (Authenticated Users) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/vehicle/:id" element={<VehicleDetails />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/purchases" element={<PurchasesPage />} />
                <Route path="/activity" element={<ActivityPage />} />
              </Route>

              {/* Admin-only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Fallback 404 Route */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'bg-slate-900 text-slate-100 border border-slate-800',
              duration: 4000,
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
