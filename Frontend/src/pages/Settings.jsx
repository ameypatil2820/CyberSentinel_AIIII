import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { getAuthHeaders } = useAuth();
  const [companyName, setCompanyName] = useState('ABC Corporation');
  const [supportEmail, setSupportEmail] = useState('security@abccybershield.com');
  const [require2FA, setRequire2FA] = useState(true);
  const [autoBlockIPs, setAutoBlockIPs] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/settings`, {
          headers: { ...getAuthHeaders() }
        });
        const result = await response.json();
        if (response.ok && result.success) {
          const s = result.data;
          if (s) {
            setCompanyName(s.companyName);
            setSupportEmail(s.supportEmail);
            setRequire2FA(s.require2FA);
            setAutoBlockIPs(s.autoBlockIPs);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          companyName,
          supportEmail,
          require2FA,
          autoBlockIPs
        })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Settings updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Network error. Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-cyan">
        <div className="relative flex items-center justify-center w-12 h-12 mb-4">
          <div className="absolute inset-0 border-4 border-brand-cyan/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
          <Shield className="w-5 h-5 text-brand-cyan animate-pulse" />
        </div>
        <p className="text-sm font-semibold tracking-widest text-brand-cyan/80 animate-pulse">
          LOADING SETTINGS...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure global platform preferences and security policies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Company Name</label>
              <Input 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-400 mb-1 block">Support Email</label>
              <Input 
                value={supportEmail} 
                onChange={(e) => setSupportEmail(e.target.value)} 
              />
            </div>
            <Button variant="primary" className="mt-4" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <div>
                <p className="font-medium text-white text-sm">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-slate-500">Require 2FA for all administrative accounts.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={require2FA} 
                  onChange={(e) => setRequire2FA(e.target.checked)} 
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cyan"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
              <div>
                <p className="font-medium text-white text-sm">Auto-Block Malicious IPs</p>
                <p className="text-xs text-slate-500">Automatically block IPs with Threat Score {'>'} 90.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={autoBlockIPs} 
                  onChange={(e) => setAutoBlockIPs(e.target.checked)} 
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-cyan"></div>
              </label>
            </div>
            <Button variant="primary" className="mt-4" onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Updating...' : 'Update Policies'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
