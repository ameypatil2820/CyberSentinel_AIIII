import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    // Email checks
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Please enter a valid email address.');
        isValid = false;
      }
    }

    // Password checks
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    const result = await login(email, password);
    if (result.success) {
      // Redirection handled dynamically inside DashboardRedirect helper or role based
      const storedUsers = JSON.parse(localStorage.getItem("cs_users")) || [];
      const found = storedUsers.find(u => u.email === email);
      const activeRole = found ? found.role : (email === "admin@patilcybershield.com" ? "Super Admin" : "Employee");
      navigate(activeRole === 'Employee' ? '/phishing-detection' : '/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-brand-cyan/10 p-4 rounded-full border border-brand-cyan/20">
            <Shield className="w-12 h-12 text-brand-cyan" />
          </div>
        </div>
        
        <Card className="backdrop-blur-xl bg-slate-900/80">
          <CardHeader className="text-center border-b-0 pb-2">
            <CardTitle className="text-2xl text-white">ABC Cyber Shield</CardTitle>
            <p className="text-slate-400 text-sm mt-2">
              Sign in to access the control center
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <Input 
                    type="email" 
                    placeholder="name@patilcybershield.com" 
                    className={`pl-10 ${emailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {emailError && (
                  <span className="text-red-400 text-xs mt-1 block ml-1">{emailError}</span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  <button type="button" className="text-xs text-brand-cyan hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className={`pl-10 pr-10 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordError && (
                  <span className="text-red-400 text-xs mt-1 block ml-1">{passwordError}</span>
                )}
              </div>

              <Button type="submit" variant="cyan" className="w-full mt-6">
                Authenticate Securely
              </Button>
            </form>

            <div className="mt-4 p-3 bg-brand-cyan/10 border border-brand-cyan/20 rounded-lg text-xs text-slate-300 text-center">
              <p className="font-semibold mb-1 text-brand-cyan">Teacher / Demo Credentials:</p>
              <p>Email: admin@patilcybershield.com</p>
              <p>Password: P@tilcybershield1207</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-600 mt-4">
                Authorized Personnel Only. All activities are monitored.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
