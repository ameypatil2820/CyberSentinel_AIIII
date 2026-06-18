import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShieldAlert, Shield, Activity, 
  Search, AlertTriangle, MessageSquare, Bell, 
  FileText, Users, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn, Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';

export const navItems = [
  { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Super Admin', 'Security Analyst'] },
  { id: 'threat-monitoring', path: '/threat-monitoring', icon: Activity, label: 'Threat Monitoring', roles: ['Super Admin', 'Security Analyst'] },
  { id: 'phishing-detection', path: '/phishing-detection', icon: ShieldAlert, label: 'Phishing Detection', roles: ['Super Admin', 'Security Analyst', 'Employee'] },
  { id: 'malware-analysis', path: '/malware-analysis', icon: Search, label: 'Malware Analysis', roles: ['Super Admin', 'Security Analyst'] },
  { id: 'vulnerability-scanner', path: '/vulnerability-scanner', icon: Shield, label: 'Vulnerability Scanner', roles: ['Super Admin', 'Security Analyst'] },
  { id: 'incident-response', path: '/incident-response', icon: AlertTriangle, label: 'Incident Response', roles: ['Super Admin', 'Security Analyst'] },
  { id: 'ai-assistant', path: '/ai-assistant', icon: MessageSquare, label: 'AI Assistant', roles: ['Super Admin', 'Security Analyst', 'Employee'] },
  { id: 'alerts', path: '/alerts', icon: Bell, label: 'Alerts', roles: ['Super Admin', 'Security Analyst', 'Employee'] },
  { id: 'reports', path: '/reports', icon: FileText, label: 'Reports', roles: ['Super Admin', 'Security Analyst'] },
  { id: 'users', path: '/users', icon: Users, label: 'Employees', roles: ['Super Admin'] },
  { id: 'permissions', path: '/permissions', icon: Shield, label: 'Employee Permissions', roles: ['Super Admin'] },
  { id: 'settings', path: '/settings', icon: Settings, label: 'Settings', roles: ['Super Admin', 'Security Analyst', 'Employee'] },
];

export const getFilteredNavItems = (user) => {
  return navItems.filter((item) => {
    if (!user) return false;
    
    // Super Admins always see all their allowed role items, ignoring specific restrictions
    if (user.role === 'Super Admin') {
      return !item.roles || item.roles.includes(user.role);
    }

    // If user has specific permissions defined, those override the base role access
    if (user.permissions && user.permissions.length > 0) {
      return user.permissions.includes(item.id);
    }
    // Otherwise fallback to role-based access
    return !item.roles || item.roles.includes(user.role);
  });
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const filteredNavItems = getFilteredNavItems(user);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  return (
    <>
      <aside className="w-64 h-screen glass-panel rounded-none border-t-0 border-b-0 border-l-0 fixed left-0 top-0 hidden md:flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-cyan" />
          <span className="font-bold text-lg tracking-wide text-white">ABC Cyber Shield</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm",
                  isActive 
                    ? "bg-brand-blue/20 text-brand-cyan border border-brand-blue/30" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center justify-center cursor-pointer gap-2 px-3 py-2.5 rounded-lg text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-400 transition-all font-bold text-sm shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan">
                  <LogOut className="w-6 h-6 ml-1" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Sign Out?</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Are you sure you want to end your current session?
                  </p>
                </div>
                <div className="flex w-full gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowLogoutConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="cyan" className="flex-1" onClick={handleLogout}>
                    Yes, Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
