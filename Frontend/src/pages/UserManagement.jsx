import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Pagination } from '../components/Pagination';
import { UserPlus, ShieldCheck, Mail, Lock, User as UserIcon, Eye, Edit2, Trash2, CheckCircle, XCircle, AlertTriangle, Phone } from 'lucide-react';

export function UserManagement() {
  const { users, toggleUserStatus, deleteUser, fetchData } = useData();
  const { getAuthHeaders } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToToggleStatus, setUserToToggleStatus] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [mobile, setMobile] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
    { id: 'settings', label: 'Settings' }
  ];

  const handlePermissionToggle = (moduleId, isEdit = false) => {
    const setState = isEdit ? setEditPermissions : setPermissions;
    const currentState = isEdit ? editPermissions : permissions;
    
    if (currentState.includes(moduleId)) {
      setState(currentState.filter(id => id !== moduleId));
    } else {
      setState([...currentState, moduleId]);
    }
  };

  const confirmToggleStatus = async () => {
    if (!userToToggleStatus) return;
    setError('');
    setSuccess('');
    const res = await toggleUserStatus(userToToggleStatus._id || userToToggleStatus.id, userToToggleStatus.status);
    if (!res.success) {
      setError(res.message || 'Failed to update user status.');
    } else {
      setSuccess('User status updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    }
    setUserToToggleStatus(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setError('');
    setSuccess('');
    const res = await deleteUser(userToDelete._id || userToDelete.id);
    if (res.success) {
      setSuccess('User deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.message || 'Failed to delete user.');
    }
    setUserToDelete(null);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ name, email, password, role, mobile, permissions })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSuccess('User created successfully!');
        setName('');
        setEmail('');
        setPassword('');
        setRole('Employee');
        setMobile('');
        setPermissions([]);
        setShowAddForm(false);
        // Refresh users list
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to create user.');
      }
    } catch (err) {
      setError('Network error while creating user.');
    }
    setLoading(false);
  };

  const [userToEdit, setUserToEdit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('Employee');
  const [editMobile, setEditMobile] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPermissions, setEditPermissions] = useState([]);
  
  const [userToView, setUserToView] = useState(null);

  const openEditModal = (user) => {
    setError('');
    setSuccess('');
    setUserToEdit(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditMobile(user.mobile || '');
    setEditEmail(user.email || '');
    setEditPassword(''); // Reset password field
    setEditPermissions(user.permissions || []);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (editPassword && editPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/users/${userToEdit._id || userToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ 
          name: editName, 
          role: editRole, 
          mobile: editMobile, 
          email: editEmail, 
          permissions: editPermissions,
          ...(editPassword ? { password: editPassword } : {}) 
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSuccess('User updated successfully!');
        setUserToEdit(null);
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to update user.');
      }
    } catch (err) {
      setError('Network error while updating user.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage platform access and role permissions.</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)} className="w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add User'}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          {success}
        </div>
      )}

      {showAddForm && (
        <Card className="border-brand-cyan/30">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="text" 
                      placeholder="User Name" 
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="email" 
                      placeholder="user@patilcybershield.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="text" 
                      placeholder="+91 9876543210" 
                      className="pl-10"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Access Role</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <select
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Employee" className="bg-slate-900 text-white">Employee</option>
                      <option value="Security Analyst" className="bg-slate-900 text-white">Security Analyst</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Permissions Section (Add Form) */}
              <div className="pt-4 border-t border-slate-800">
                <label className="text-sm font-medium text-slate-300 mb-2 block">Specific Module Permissions (Overrides Role Default)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableModules.map(module => (
                    <label key={module.id} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-200">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-700 bg-slate-900 text-brand-cyan focus:ring-brand-cyan"
                        checked={permissions.includes(module.id)}
                        onChange={() => handlePermissionToggle(module.id, false)}
                      />
                      {module.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="cyan" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-hidden md:overflow-x-auto">
            <table className="w-full text-sm text-left block md:table">
              <thead className="hidden md:table-header-group text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg w-16 text-center">Sr. No.</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {paginatedUsers.map((user, index) => (
                  <tr key={user._id || user.id} className="block md:table-row border border-slate-700 md:border-0 md:border-b border-slate-800 hover:bg-slate-800/30 bg-slate-900/50 md:bg-transparent rounded-xl mb-4 md:mb-0 p-4 md:p-0 transition-colors">
                    <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-4 text-slate-400 font-medium border-b border-slate-800 md:border-0">
                      <span className="md:hidden text-xs uppercase font-bold text-slate-500">Sr. No.</span>
                      <span className="text-center md:text-left w-full md:w-auto">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-4 border-b border-slate-800 md:border-0">
                      <span className="md:hidden text-xs uppercase font-bold text-slate-500">User</span>
                      <div className="text-right md:text-left">
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-4 border-b border-slate-800 md:border-0">
                      <span className="md:hidden text-xs uppercase font-bold text-slate-500">Role</span>
                      <Badge variant={user.role === 'Super Admin' ? 'purple' : user.role === 'Security Analyst' ? 'info' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-4 text-sm text-slate-300 border-b border-slate-800 md:border-0">
                      <span className="md:hidden text-xs uppercase font-bold text-slate-500">Mobile</span>
                      {user.mobile || '-'}
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-4 border-b border-slate-800 md:border-0">
                      <span className="md:hidden text-xs uppercase font-bold text-slate-500">Status</span>
                      <Badge variant={user.status === 'Active' ? 'success' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-3 md:py-4 md:text-right">
                      <span className="md:hidden text-xs uppercase font-bold text-slate-500">Actions</span>
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          title="View Details"
                          onClick={() => setUserToView(user)}
                          className="p-1.5 h-auto text-slate-400 hover:text-brand-cyan hover:bg-slate-800/50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          title="Edit User"
                          onClick={() => openEditModal(user)}
                          className="p-1.5 h-auto text-slate-400 hover:text-blue-400 hover:bg-slate-800/50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => setUserToToggleStatus(user)}
                          className={`p-1.5 h-auto ${user.status === 'Active' ? 'text-slate-400 hover:text-orange-400' : 'text-slate-400 hover:text-green-400'} hover:bg-slate-800/50`}
                        >
                          {user.status === 'Active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          title="Delete User"
                          onClick={() => setUserToDelete(user)}
                          className="p-1.5 h-auto text-slate-400 hover:text-red-400 hover:bg-slate-800/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-red-500/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete User?</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Are you sure you want to delete <span className="text-white font-medium">{userToDelete.name}</span>? This action cannot be undone.
                  </p>
                </div>
                <div className="flex w-full gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setUserToDelete(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1 bg-red-500 hover:bg-red-600 border-0" onClick={confirmDelete}>
                    Yes, Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {userToToggleStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Change Status?</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Are you sure you want to {userToToggleStatus.status === 'Active' ? 'deactivate' : 'activate'} <span className="text-white font-medium">{userToToggleStatus.name}</span>?
                  </p>
                </div>
                <div className="flex w-full gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setUserToToggleStatus(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" className="flex-1 bg-orange-500 hover:bg-orange-600 border-0" onClick={confirmToggleStatus}>
                    Yes, {userToToggleStatus.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Edit User Modal */}
      {userToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-brand-cyan/30">
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="text" 
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">New Password <span className="text-slate-500 text-[10px]">(Leave blank to keep current)</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 ml-1">Access Role</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                    <select
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan transition-colors"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="Employee">Employee</option>
                      <option value="Security Analyst">Security Analyst</option>
                    </select>
                  </div>
                </div>

                {/* Permissions Section (Edit Form) */}
                <div className="pt-4 border-t border-slate-800">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Specific Module Permissions (Overrides Role Default)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableModules.map(module => (
                      <label key={module.id} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer hover:text-slate-200">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-700 bg-slate-900 text-brand-cyan focus:ring-brand-cyan"
                          checked={editPermissions.includes(module.id)}
                          onChange={() => handlePermissionToggle(module.id, true)}
                        />
                        {module.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex w-full gap-3 mt-4">
                  <Button variant="outline" className="flex-1" type="button" onClick={() => setUserToEdit(null)}>
                    Cancel
                  </Button>
                  <Button variant="cyan" className="flex-1" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View User Details Modal */}
      {userToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-sm bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase">Name</p>
                  <p className="text-white font-medium">{userToView.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Email</p>
                  <p className="text-white font-medium">{userToView.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Mobile</p>
                  <p className="text-white font-medium">{userToView.mobile || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Role</p>
                  <Badge variant={userToView.role === 'Super Admin' ? 'purple' : userToView.role === 'Security Analyst' ? 'info' : 'default'} className="mt-1">
                    {userToView.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Status</p>
                  <Badge variant={userToView.status === 'Active' ? 'success' : 'destructive'} className="mt-1">
                    {userToView.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase">Specific Permissions</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {userToView.permissions && userToView.permissions.length > 0 ? (
                      userToView.permissions.map(perm => (
                        <Badge key={perm} variant="outline" className="text-xs text-slate-300 border-slate-600">
                          {perm}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500 italic">Default role access</span>
                    )}
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full" onClick={() => setUserToView(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
