import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, UserCircle, Search, Menu, X, LogOut } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { getFilteredNavItems } from './Sidebar';
import { cn } from '../components/Card';

export function Topbar() {
  const { user, logout } = useAuth();
  const { alerts, markAlertAsRead } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  const filteredNavItems = getFilteredNavItems(user);
  
  const unreadAlertsList = alerts.filter(a => !a.isRead);
  const unreadAlerts = unreadAlertsList.length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 glass-panel rounded-none border-t-0 border-x-0 fixed top-0 right-0 left-0 md:left-64 z-10 flex items-center justify-between px-4 md:px-6">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden relative" ref={mobileMenuRef}>
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="text-slate-400 hover:text-white transition-colors pr-4 border-r border-slate-700 h-8 flex items-center"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        {showMobileMenu && (
          <div className="absolute left-0 mt-5 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
            <div className="p-2 max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium text-sm mb-1",
                    isActive 
                      ? "bg-brand-blue/20 text-brand-cyan" 
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
              <div className="border-t border-slate-800 mt-2 pt-2">
                <button 
                  onClick={() => { setShowMobileMenu(false); logout(); }}
                  className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors font-medium text-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-cyan text-slate-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute -right-16 md:right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm md:w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <button onClick={() => { setShowNotifications(false); navigate('/alerts'); }} className="text-xs text-brand-cyan hover:underline">
                  View All
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-900 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
                {unreadAlertsList.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No new notifications
                  </div>
                ) : (
                  unreadAlertsList.slice(0, 5).map(alert => (
                    <div 
                      key={alert._id || alert.id} 
                      className="p-3 border-b border-slate-800 bg-slate-800/20 hover:bg-slate-800/50 cursor-pointer"
                      onClick={() => { 
                        markAlertAsRead(alert._id || alert.id);
                        setShowNotifications(false); 
                        navigate('/alerts'); 
                      }}
                    >
                      <p className="text-sm text-white line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {new Date(alert.timestamp || alert.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={() => {
            if (location.pathname === '/profile') {
              navigate(-1);
            } else {
              navigate('/profile');
            }
          }}
          className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-700 hover:opacity-80 transition-opacity text-left cursor-pointer"
        >
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-200 leading-none">{user?.name}</p>
            <p className="text-xs text-brand-cyan mt-1">{user?.role}</p>
          </div>
          <UserCircle className="w-8 h-8 text-slate-400 hover:text-brand-cyan transition-colors" />
        </button>
      </div>
    </header>
  );
}
