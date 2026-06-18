/*
 Author: Balaji Patil
 GitHub: github.com/BalajiPatil1207
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { MainLayout } from './layouts/MainLayout';
import { Toaster } from 'react-hot-toast';

// Pages
import { Landing } from './pages/Landing';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CookiePolicy } from './pages/CookiePolicy';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ThreatMonitoring } from './pages/ThreatMonitoring';
import { PhishingDetection } from './pages/PhishingDetection';
import { MalwareAnalysis } from './pages/MalwareAnalysis';
import { VulnerabilityScanner } from './pages/VulnerabilityScanner';
import { IncidentResponse } from './pages/IncidentResponse';
import { AIAssistant } from './pages/AIAssistant';
import { Alerts } from './pages/Alerts';
import { Reports } from './pages/Reports';
import { UserManagement } from './pages/UserManagement';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Permissions } from './pages/Permissions';

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'Super Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (user.permissions && user.permissions.length > 0) {
    const validPermission = user.permissions.find(p => p);
    if (validPermission) {
      return <Navigate to={`/${validPermission}`} replace />;
    }
  }

  const defaultPath = user.role === 'Employee' ? '/phishing-detection' : '/dashboard';
  return <Navigate to={defaultPath} replace />;
}

// Role-Based Route Gate Component
function RoleProtectedRoute({ children, allowedRoles, permissionId }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Super Admins bypass specific permission checks
  if (user.role === 'Super Admin') {
    return children;
  }

  // If the user has specific module permissions defined, they override the role
  if (user.permissions && user.permissions.length > 0) {
    if (permissionId && user.permissions.includes(permissionId)) {
      return children;
    } else {
      const validPermission = user.permissions.find(p => p);
      const defaultPath = validPermission ? `/${validPermission}` : (user.role === 'Employee' ? '/phishing-detection' : '/dashboard');
      return <Navigate to={defaultPath} replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultPath = user.role === 'Employee' ? '/phishing-detection' : '/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(6, 182, 212, 0.2)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
      }} />
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected App Routes wrapped in MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/app" element={<DashboardRedirect />} />
              
              <Route path="/dashboard" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']} permissionId="dashboard">
                  <Dashboard />
                </RoleProtectedRoute>
              } />
              
              <Route path="threat-monitoring" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']} permissionId="threat-monitoring">
                  <ThreatMonitoring />
                </RoleProtectedRoute>
              } />
              
              <Route path="phishing-detection" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']} permissionId="phishing-detection">
                  <PhishingDetection />
                </RoleProtectedRoute>
              } />
              
              <Route path="malware-analysis" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']} permissionId="malware-analysis">
                  <MalwareAnalysis />
                </RoleProtectedRoute>
              } />
              
              <Route path="vulnerability-scanner" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']} permissionId="vulnerability-scanner">
                  <VulnerabilityScanner />
                </RoleProtectedRoute>
              } />
              
              <Route path="incident-response" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']} permissionId="incident-response">
                  <IncidentResponse />
                </RoleProtectedRoute>
              } />
              
              <Route path="ai-assistant" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']} permissionId="ai-assistant">
                  <AIAssistant />
                </RoleProtectedRoute>
              } />
              
              <Route path="alerts" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']} permissionId="alerts">
                  <Alerts />
                </RoleProtectedRoute>
              } />
              
              <Route path="reports" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst']} permissionId="reports">
                  <Reports />
                </RoleProtectedRoute>
              } />
              
              <Route path="users" element={
                <RoleProtectedRoute allowedRoles={['Super Admin']} permissionId="users">
                  <UserManagement />
                </RoleProtectedRoute>
              } />

              <Route path="permissions" element={
                <RoleProtectedRoute allowedRoles={['Super Admin']} permissionId="permissions">
                  <Permissions />
                </RoleProtectedRoute>
              } />
              
              <Route path="settings" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']} permissionId="settings">
                  <Settings />
                </RoleProtectedRoute>
              } />

              <Route path="profile" element={
                <RoleProtectedRoute allowedRoles={['Super Admin', 'Security Analyst', 'Employee']}>
                  <Profile />
                </RoleProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
