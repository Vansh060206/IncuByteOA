import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
      <div className="p-4 bg-slate-900 rounded-full border border-slate-800 text-indigo-400 mb-6">
        <HelpCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-slate-100 tracking-tight">404 - Page Not Found</h1>
      <p className="mt-3 text-xs text-slate-400 leading-relaxed">
        The page you are looking for does not exist or has been moved. Please verify the URL or return to the fleet dashboard.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-xs font-semibold rounded-lg text-white bg-indigo-650 hover:bg-indigo-600 transition-all shadow-sm"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

