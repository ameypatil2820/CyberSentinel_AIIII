import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { User, Mail, Shield, Save, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { user, updateProfile, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }
    
    setIsSaving(true);
    const result = await updateProfile(name, email, profilePicture);
    setIsSaving(false);

    if (result.success) {
      toast.success('Profile updated successfully!');
      setTimeout(() => navigate(-1), 1000);
    } else {
      toast.error(result.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/upload`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders()
        },
        body: formData
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setProfilePicture(result.data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(result.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; // Fallback if not proxied

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-1">
          <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-xl h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-cyan/20 to-blue-600/20"></div>
            <CardContent className="pt-12 pb-6 px-6 flex flex-col items-center text-center relative z-10">
              
              {/* Avatar Upload Container */}
              <div 
                className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 shadow-2xl flex items-center justify-center mb-4 relative cursor-pointer group overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePicture ? (
                  <img src={getImageUrl(profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-brand-cyan" />
                )}
                
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              {isUploading && <p className="text-xs text-brand-cyan mb-2 animate-pulse">Uploading...</p>}
              
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-slate-400 mb-4">{user?.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-sm font-semibold shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Shield className="w-4 h-4" />
                {user?.role}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
          <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Edit Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-400">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      value={user?.role || ''} 
                      disabled 
                      className="pl-10 bg-slate-800/50 text-slate-400 cursor-not-allowed border-slate-700"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Roles can only be modified by a Super Admin.</p>
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>Cancel</Button>
                  <Button type="submit" variant="cyan" className="shadow-[0_0_15px_rgba(0,240,255,0.3)]" disabled={isSaving || isUploading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
