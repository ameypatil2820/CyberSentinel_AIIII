import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Pagination } from '../components/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Bell, Check, AlertTriangle, Info } from 'lucide-react';

export function Alerts() {
  const { alerts, markAlertAsRead } = useData();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  const totalPages = Math.ceil(alerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = alerts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts & Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">System-wide security alerts and event notifications.</p>
        </div>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No alerts at this time.</p>
              </div>
            ) : (
              paginatedAlerts.map((alert) => (
                <div 
                  key={alert._id || alert.id} 
                  className={`p-4 rounded-xl border flex items-start justify-between ${
                    alert.isRead ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-800/50 border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 p-2 rounded-lg ${
                      alert.type === 'critical' ? 'bg-red-500/20 text-red-400' :
                      alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-brand-cyan/20 text-brand-cyan'
                    }`}>
                      {alert.type === 'critical' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                          alert.type === 'critical' ? 'destructive' :
                          alert.type === 'warning' ? 'warning' : 'info'
                        }>
                          {alert.type.toUpperCase()}
                        </Badge>
                        {!alert.isRead && <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>}
                      </div>
                      <p className={`text-sm ${alert.isRead ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                        {alert.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">{new Date(alert.timestamp || alert.createdAt).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    </div>
                  </div>
                  {!alert.isRead && (
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => markAlertAsRead(alert._id || alert.id)}>
                      <Check className="w-4 h-4 text-slate-400" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="mt-4">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
