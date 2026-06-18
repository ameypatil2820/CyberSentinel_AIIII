import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { Shield } from 'lucide-react';

export function MainLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-darker flex flex-col items-center justify-center text-brand-cyan">
        <div className="relative flex items-center justify-center w-20 h-20 mb-4">
          <div className="absolute inset-0 border-4 border-brand-cyan/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
          <Shield className="w-8 h-8 text-brand-cyan animate-pulse" />
        </div>
        <p className="text-sm font-semibold tracking-widest text-brand-cyan/80 animate-pulse">
          INITIALIZING SECURE CONNECTION...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-darker flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 w-full">
        <Topbar />
        <main className="flex-1 mt-16 p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
