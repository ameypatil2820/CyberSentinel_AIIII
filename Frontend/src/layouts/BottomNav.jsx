import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFilteredNavItems } from './Sidebar';
import { cn } from '../components/Card';

export function BottomNav() {
  const { user } = useAuth();
  const filteredNavItems = getFilteredNavItems(user);

  // Take top 5 items for the bottom nav
  const bottomNavItems = filteredNavItems.slice(0, 5);

  if (bottomNavItems.length === 0) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-slate-800 border-x-0 border-b-0 z-50 flex justify-around items-center px-2 py-2 pb-safe">
      {bottomNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[64px]",
            isActive 
              ? "text-brand-cyan" 
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          <item.icon className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium tracking-tight truncate max-w-full">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
