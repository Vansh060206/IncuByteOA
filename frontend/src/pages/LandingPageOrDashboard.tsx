import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Dashboard } from './Dashboard';
import { LandingPage } from './LandingPage';

export const LandingPageOrDashboard: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  return <LandingPage />;
};
