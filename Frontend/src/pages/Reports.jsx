import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { FileText, Download, BarChart2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Reports() {
  const { getAuthHeaders } = useAuth();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingCSV, setGeneratingCSV] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadPDF = async () => {
    setGeneratingPDF(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/reports/export-pdf`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Executive_Security_Report.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const resData = await response.json();
        setError(resData.message || 'Failed to compile and download PDF report.');
      }
    } catch (err) {
      console.error(err);
      setError('Network connection error occurred during report generation.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDownloadCSV = async () => {
    setGeneratingCSV(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/reports/export-csv`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Threat_History_Logs.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const resData = await response.json();
        setError(resData.message || 'Failed to download threat logs CSV.');
      }
    } catch (err) {
      console.error(err);
      setError('Network connection error occurred during CSV download.');
    } finally {
      setGeneratingCSV(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Generate and download comprehensive security reports.</p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-cyan" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-6">High-level overview of security posture, blocked threats, and overall risk score.</p>
            <Button variant="outline" className="w-full" onClick={handleDownloadPDF} disabled={generatingPDF}>
              <Download className="w-4 h-4 mr-2" />
              {generatingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-brand-purple" />
              Threat Analytics Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-6">Detailed spreadsheet CSV breakdown of attack vectors, malware types, and targeted assets.</p>
            <Button variant="outline" className="w-full" onClick={handleDownloadCSV} disabled={generatingCSV}>
              <Download className="w-4 h-4 mr-2" />
              {generatingCSV ? 'Generating...' : 'Download CSV'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-blue" />
              Compliance Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-6">Audit summaries and vulnerability status mapped directly to SOC2 controls.</p>
            <Button variant="outline" className="w-full" onClick={handleDownloadPDF} disabled={generatingPDF}>
              <Download className="w-4 h-4 mr-2" />
              {generatingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-hidden md:overflow-x-auto">
            <table className="w-full text-sm text-left block md:table">
              <thead className="hidden md:table-header-group text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg w-16 text-center">Sr. No.</th>
                  <th className="px-4 py-3">Report Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Generated By</th>
                  <th className="px-4 py-3 rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                <tr className="block md:table-row border border-slate-700 md:border-0 md:border-b border-slate-800 hover:bg-slate-800/30 bg-slate-900/50 md:bg-transparent rounded-xl mb-4 md:mb-0 p-4 md:p-0 transition-colors">
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 text-slate-400 font-medium border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Sr. No.</span>
                    <span className="text-center md:text-left w-full md:w-auto">1</span>
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Report Name</span>
                    <div className="flex items-center gap-2 font-medium text-white">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Monthly_Threat_Summary_May.pdf
                    </div>
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 text-slate-400 border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Type</span>
                    Threat Analytics
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 text-slate-400 border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Generated By</span>
                    System Admin
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 text-slate-400 border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Date</span>
                    01 Jun 2026
                  </td>
                </tr>
                <tr className="block md:table-row border border-slate-700 md:border-0 md:border-b border-slate-800 hover:bg-slate-800/30 bg-slate-900/50 md:bg-transparent rounded-xl mb-4 md:mb-0 p-4 md:p-0 transition-colors">
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 text-slate-400 font-medium border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Sr. No.</span>
                    <span className="text-center md:text-left w-full md:w-auto">2</span>
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Report Name</span>
                    <div className="flex items-center gap-2 font-medium text-white">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Q1_Compliance_Audit.pdf
                    </div>
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 text-slate-400 border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Type</span>
                    Compliance
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 text-slate-400 border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Generated By</span>
                    Security Officer
                  </td>
                  <td className="flex justify-between items-center md:table-cell px-2 md:px-4 py-2 md:py-3 text-slate-400 border-b border-slate-800 md:border-0">
                    <span className="md:hidden text-xs uppercase font-bold text-slate-500">Date</span>
                    15 Apr 2026
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
