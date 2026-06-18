import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Mail, Link as LinkIcon, ShieldCheck, ShieldAlert, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function PhishingDetection() {
  const { getAuthHeaders } = useAuth();
  const { fetchData } = useData();
  const [content, setContent] = useState('');
  const [type, setType] = useState('email'); // email or url
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!content.trim()) return;

    if (type === 'url') {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(content.trim())) {
        setError('Please enter a valid URL or link.');
        return;
      }
    } else if (type === 'email') {
      if (content.trim().length < 15) {
        setError('Email content is too short for analysis. Please provide more text.');
        return;
      }
    }

    setScanning(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/security/phishing-scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ type, content })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setResult(resData.data);
        // Refresh global dashboard data (incidents, threats, alerts lists) in background
        fetchData();
      } else {
        setError(resData.message || 'Phishing analysis scan failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error occurred during phishing scan.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Phishing & URL Detection</h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered email content and link analyzer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Content Analyzer</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <div className="flex gap-2 p-1 bg-slate-900/50 rounded-lg w-fit">
              <button 
                onClick={() => setType('email')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${type === 'email' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2"><Mail className="w-4 h-4"/> Email Text</div>
              </button>
              <button 
                onClick={() => setType('url')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${type === 'url' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2"><LinkIcon className="w-4 h-4"/> URL / Link</div>
              </button>
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center font-semibold">
                {error}
              </div>
            )}

            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'email' ? "Paste email headers and content here..." : "e.g. secure-login-verify-account.com/reset-password"}
              className="w-full flex-1 min-h-[200px] glass-input resize-none p-4 font-mono text-sm"
            />
            
            <Button variant="cyan" onClick={handleScan} disabled={scanning || !content.trim()}>
              {scanning ? 'Analyzing Content...' : 'Run Security Scan'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !scanning && (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-slate-500">
                <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                <p>Submit content to run the analysis.</p>
              </div>
            )}
            
            {scanning && (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin"></div>
                <p className="text-brand-cyan animate-pulse">AI is analyzing patterns...</p>
              </div>
            )}

            {result && !scanning && (
              <div className="space-y-6">
                <div className={`p-6 rounded-xl border flex items-center justify-between ${
                  result.classification === 'High Risk' 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : result.classification === 'Suspicious'
                    ? 'bg-orange-500/10 border-orange-500/20'
                    : 'bg-green-500/10 border-green-500/20'
                }`}>
                  <div className="flex items-center gap-4">
                    {result.classification === 'High Risk' ? (
                      <ShieldAlert className="w-12 h-12 text-red-400" />
                    ) : result.classification === 'Suspicious' ? (
                      <AlertTriangle className="w-12 h-12 text-orange-400" />
                    ) : (
                      <ShieldCheck className="w-12 h-12 text-green-400" />
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${
                        result.classification === 'High Risk' 
                          ? 'text-red-400' 
                          : result.classification === 'Suspicious'
                          ? 'text-orange-400'
                          : 'text-green-400'
                      }`}>
                        {result.classification === 'High Risk' 
                          ? 'High Risk Detected' 
                          : result.classification === 'Suspicious'
                          ? 'Suspicious Content'
                          : 'Safe Content'}
                      </h3>
                      <p className="text-slate-350 font-medium mt-1">AI Threat Score: {result.score}/100</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Analysis Breakdown</h4>
                  <ul className="space-y-3">
                    {result.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                        <ChevronRight className="w-5 h-5 text-brand-cyan shrink-0 animate-pulse" />
                        <span className="text-slate-350 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {(result.classification === 'High Risk' || result.classification === 'Suspicious') && (
                    <div className="pt-4 border-t border-slate-800">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">Recommended Actions</h4>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="text-red-450 border-red-900/50 hover:bg-red-900/25"
                          onClick={() => toast.success('Indicator blocked successfully!')}
                        >
                          Block Indicator
                        </Button>
                        <Button variant="primary" onClick={() => window.location.href = '/incident-response'}>Create Incident Ticket</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
