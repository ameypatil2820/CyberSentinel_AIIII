import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export function Permissions() {
  const { users, fetchData } = useData();
  const { getAuthHeaders } = useAuth();
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  const availableModules = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'threat-monitoring', label: 'Threat Monitoring' },
    { id: 'phishing-detection', label: 'Phishing Detection' },
    { id: 'malware-analysis', label: 'Malware Analysis' },
    { id: 'vulnerability-scanner', label: 'Vulnerability Scanner' },
    { id: 'incident-response', label: 'Incident Response' },
    { id: 'ai-assistant', label: 'AI Assistant' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'reports', label: 'Reports' },
    { id: 'users', label: 'User Management' },
    { id: 'permissions', label: 'Permissions Management' },
    { id: 'settings', label: 'Settings' }
  ];

  useEffect(() => {
    if (selectedUserId) {
      const user = users.find(u => (u._id || u.id) === selectedUserId);
      setSelectedUser(user);
      setPermissions(user?.permissions || []);
    } else {
      setSelectedUser(null);
      setPermissions([]);
    }
  }, [selectedUserId, users]);

  const handleToggle = (moduleId) => {
    if (permissions.includes(moduleId)) {
      setPermissions(permissions.filter(id => id !== moduleId));
    } else {
      setPermissions([...permissions, moduleId]);
    }
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/users/${selectedUser._id || selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ 
          permissions 
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Permissions updated successfully!');
        fetchData();
      } else {
        toast.error(result.message || 'Failed to update permissions.');
      }
    } catch (err) {
      toast.error('Network error. Failed to save.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Permissions Management</h1>
        <p className="text-slate-400 text-sm mt-1">Assign specific module access to system users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Select User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400">Choose a user to manage permissions</label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">-- Select a User --</option>
                {users.filter(u => u.role !== 'Super Admin').map(user => (
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>

              {selectedUser && (
                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 mt-6 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Email</p>
                    <p className="text-sm text-slate-300">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Role Base Access</p>
                    <Badge variant="info" className="mt-1">{selectedUser.role}</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-cyan" />
              Module Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedUser ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <Shield className="w-12 h-12 mb-3 opacity-20" />
                <p>Select a user to configure permissions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-slate-400">
                  Toggle specific modules for this user. These specific permissions will override their default Role access.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableModules.map(module => {
                    const hasAccess = permissions.includes(module.id);
                    return (
                      <div 
                        key={module.id}
                        onClick={() => handleToggle(module.id)}
                        className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                          hasAccess ? 'bg-brand-cyan/10 border-brand-cyan/50' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <span className={`text-sm font-medium ${hasAccess ? 'text-brand-cyan' : 'text-slate-300'}`}>
                          {module.label}
                        </span>
                        {hasAccess && <Check className="w-4 h-4 text-brand-cyan" />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <Button variant="cyan" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Permissions'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
