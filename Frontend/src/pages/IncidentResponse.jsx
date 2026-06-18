import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Pagination } from '../components/Pagination';
import { Plus, MessageSquare, Clock, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function IncidentResponse() {
  const { incidents, updateIncident, addIncident, addIncidentNote, users } = useData();
  const { user } = useAuth();
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(incidents.length / ITEMS_PER_PAGE);
  const paginatedIncidents = incidents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Create ticket form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newAssignee, setNewAssignee] = useState('');
  const [formError, setFormError] = useState('');

  // Note text state
  const [noteText, setNoteText] = useState('');

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return <Badge variant="destructive">Critical</Badge>;
      case 'High': return <Badge variant="warning">High</Badge>;
      case 'Medium': return <Badge variant="info">Medium</Badge>;
      default: return <Badge>Low</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open': return <Badge variant="destructive">Open</Badge>;
      case 'Investigating': return <Badge variant="warning">Investigating</Badge>;
      case 'Mitigated': return <Badge variant="info">Mitigated</Badge>;
      case 'Resolved': return <Badge variant="success">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newTitle.trim()) {
      setFormError('Incident title is required.');
      return;
    }

    const res = await addIncident({
      title: newTitle,
      priority: newPriority,
      assignee: newAssignee || null
    });

    if (res.success) {
      setNewTitle('');
      setNewPriority('Medium');
      setNewAssignee('');
      setShowCreateForm(false);
    } else {
      setFormError(res.message || 'Failed to create incident.');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    const res = await addIncidentNote(selectedIncident._id || selectedIncident.id, noteText);
    if (res.success) {
      setSelectedIncident(res.data);
      setNoteText('');
    }
  };

  const handleStatusChange = async (newStatus) => {
    const res = await updateIncident(selectedIncident._id || selectedIncident.id, { status: newStatus });
    if (res.success) {
      setSelectedIncident(res.data);
    }
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    const res = await updateIncident(selectedIncident._id || selectedIncident.id, { assignee: newAssigneeId || null });
    if (res.success) {
      setSelectedIncident(res.data);
    }
  };

  // Only allow Super Admins & Security Analysts to assign/view users
  const securityAnalysts = users.filter(u => u.role === 'Security Analyst' || u.role === 'Super Admin');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Incident Response Center</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track security incidents.</p>
        </div>
        <Button variant="cyan" onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Incident
        </Button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
              <CardTitle className="text-white text-lg">Report New Incident</CardTitle>
              <button 
                onClick={() => setShowCreateForm(false)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {formError && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center">
                  {formError}
                </div>
              )}
              <form onSubmit={handleCreateIncident} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Incident Title / Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Host port sweep detection"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Severity Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Assign to Security Personnel</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="">Unassigned</option>
                    {securityAnalysts.map((analyst) => (
                      <option key={analyst._id || analyst.id} value={analyst._id || analyst.id}>
                        {analyst.name} ({analyst.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                  <Button variant="outline" type="button" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button variant="cyan" type="submit">
                    Create Ticket
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="h-[calc(100vh-180px)] flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle>Active Tickets</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
              {incidents.length === 0 ? (
                <div className="text-center text-slate-500 py-10 text-sm italic">
                  No active incidents logged.
                </div>
              ) : (
                paginatedIncidents.map((incident) => (
                  <div 
                    key={incident._id || incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      selectedIncident?._id === incident._id || selectedIncident?.id === incident.id
                        ? 'bg-slate-800 border-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-slate-400">{(incident._id || incident.id).substring(0, 8)}</span>
                      {getStatusBadge(incident.status)}
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">{incident.title}</h4>
                    <div className="flex justify-between items-center text-xs">
                      {getPriorityBadge(incident.priority)}
                      <span className="text-slate-500">{new Date(incident.date || incident.createdAt).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <div className="border-t border-slate-800 p-2">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedIncident ? (
            <Card className="h-[calc(100vh-180px)] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <AlertTriangle className="w-64 h-64 text-white" />
              </div>
              <CardHeader className="border-b border-slate-800 pb-4 z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      {selectedIncident.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                      <span className="font-mono text-brand-cyan">{(selectedIncident._id || selectedIncident.id)}</span> • 
                      Created {new Date(selectedIncident.date || selectedIncident.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedIncident.status)}
                    {getPriorityBadge(selectedIncident.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-6 z-10 space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Assigned To</p>
                    <select
                      className="bg-transparent border-none outline-none text-white font-medium p-0 w-full cursor-pointer"
                      value={selectedIncident.assignee?._id || selectedIncident.assignee || ""}
                      onChange={(e) => handleAssigneeChange(e.target.value)}
                    >
                      <option value="" className="bg-slate-900 text-slate-400">Unassigned</option>
                      {securityAnalysts.map((analyst) => (
                        <option key={analyst._id || analyst.id} value={analyst._id || analyst.id} className="bg-slate-900">
                          {analyst.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Current Status</p>
                    <select 
                      className="bg-transparent border-none outline-none text-white font-medium p-0 w-full cursor-pointer"
                      value={selectedIncident.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="Open" className="bg-slate-900">Open</option>
                      <option value="Investigating" className="bg-slate-900">Investigating</option>
                      <option value="Mitigated" className="bg-slate-900">Mitigated</option>
                      <option value="Resolved" className="bg-slate-900">Resolved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 border-b border-slate-800 pb-2">Investigation Notes</h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {selectedIncident.notes && selectedIncident.notes.length > 0 ? (
                      selectedIncident.notes.map((note, idx) => (
                        <div key={idx} className="bg-slate-800/30 rounded-lg p-4 border border-slate-800/50">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-xs text-white font-bold">
                              {note.author ? note.author.substring(0, 2).toUpperCase() : 'AN'}
                            </div>
                            <span className="text-sm font-medium text-slate-300">{note.author}</span>
                            <span className="text-xs text-slate-500 ml-auto">{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-slate-400">{note.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic">No investigation notes entered yet.</p>
                    )}
                  </div>
                </div>

              </CardContent>
              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex gap-3 z-10">
                <input 
                  type="text" 
                  placeholder="Add investigation notes..." 
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
                />
                <Button variant="primary" onClick={handleAddNote} disabled={!noteText.trim()}>Add Note</Button>
              </div>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-180px)] flex flex-col items-center justify-center text-slate-500 border-dashed border-2 border-slate-800 bg-transparent">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p>Select an incident from the list to view details.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
