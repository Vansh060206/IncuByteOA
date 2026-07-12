import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { InventoryPage } from './InventoryPage';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  // Standard user showroom catalog
  return <InventoryPage />;
};
