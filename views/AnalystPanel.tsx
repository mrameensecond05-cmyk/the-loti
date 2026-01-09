
import React, { useState, useEffect } from 'react';
import { 
  Filter, Search, Clock, Cpu, ChevronRight, MessageSquare, 
  ExternalLink, Hash, Info, UserPlus, FileText, Send, FolderKanban, Plus
} from 'lucide-react';
import { MOCK_ALERTS, COLORS } from '../constants';
import { Severity } from '../types';

interface Note {
  id: string;
  author: string;
  timestamp: string;
  text: string;
  isSystem?: boolean;
}

interface Artifact {
  id: string;
  name: string;
  hash: string;
}

const AnalystPanel: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<any>(MOCK_ALERTS[0]);
  const [activeCaseTab, setActiveCaseTab] = useState<'notes' | 'artifacts'>('notes');
  
  // Real-time state for Case Management
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      author: 'Analyst J. Doe',
      timestamp: '2h ago',
      text: 'Identified suspicious obfuscated command in PowerShell execution. Matches EMOTET pattern. Requesting isolation of WKSTN-01.'
    },
    {
      id: '2',
      author: 'System Bot',
      timestamp: '1h ago',
      text: 'Added SHA-256 artifact to the case track.',
      isSystem: true
    }
  ]);

  const [artifacts, setArtifacts] = useState<Artifact[]>([
    { id: 'art-1', name: 'malicious_script_1.ps1', hash: '5f4dcc3b5aa765d61d8327deb882cf99' },
    { id: 'art-2', name: 'malicious_script_2.ps1', hash: '7c4dcc3b5aa765d61d8327deb882cf11' }
  ]);

  const [newNoteText, setNewNoteText] = useState('');

  const getSeverityColor = (sev: Severity) => {
    switch(sev) {
      case Severity.CRITICAL: return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case Severity.HIGH: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case Severity.MEDIUM: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
    }
  };

  const handlePostNote = () => {
    if (!newNoteText.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      author: 'Senior Analyst J. Harkness',
      timestamp: 'Just now',
      text: newNoteText
    };

    setNotes(prev => [newNote, ...prev]);
    setNewNoteText('');
  };

  const handleUploadArtifact = () => {
    const id = Math.floor(Math.random() * 1000);
    const newArtifact: Artifact = {
      id: `art-${id}`,
      name: `forensic_dump_${id}.bin`,
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };

    setArtifacts(prev => [newArtifact, ...prev]);
    
    // Add a system note about the upload
    const systemNote: Note = {
      id: `sys-${Date.now()}`,
      author: 'System Bot',
      timestamp: 'Just now',
      text: `Uploaded new artifact: ${newArtifact.name}`,
      isSystem: true
    };
    setNotes(prev => [systemNote, ...prev]);
  };

  return (
    <div className="flex h-full gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Alert List */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className={`${COLORS.panel} border ${COLORS.border} rounded-xl overflow-hidden flex flex-col h-full`}>
          <div className={`p-4 border-b ${COLORS.border} flex items-center justify-between`}>
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter alerts by host, rule, or PID..." 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-700">
                <Filter size={14} /> Filter
              </button>
            </div>
            <div className="text-sm text-slate-400 font-medium">
              Showing {MOCK_ALERTS.length} active detections
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-900 shadow-sm">
                <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-800">Timestamp</th>
                  <th className="px-6 py-4 border-b border-slate-800">Hostname</th>
                  <th className="px-6 py-4 border-b border-slate-800">Severity</th>
                  <th className="px-6 py-4 border-b border-slate-800">Rule Triggered</th>
                  <th className="px-6 py-4 border-b border-slate-800">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {MOCK_ALERTS.map((alert) => (
                  <tr 
                    key={alert.id} 
                    onClick={() => setSelectedAlert(alert)}
                    className={`cursor-pointer transition-colors ${selectedAlert?.id === alert.id ? 'bg-emerald-500/5' : 'hover:bg-slate-800/30'}`}
                  >
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{alert.timestamp}</td>
                    <td className="px-6 py-4 font-medium text-sm">{alert.hostname}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-200">{alert.ruleTriggered}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${alert.confidence > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${alert.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono font-bold">{alert.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forensic Detailed Investigation Area */}
        {selectedAlert && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-[400px]">
            {/* Process Tree */}
            <div className={`${COLORS.panel} border ${COLORS.border} rounded-xl p-6 flex flex-col`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Cpu size={16} className="text-emerald-500" />
                  Process Relationship Tree
                </h4>
                <div className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">PID: {selectedAlert.processId}</div>
              </div>
              
              <div className="flex-1 relative bg-slate-950/50 rounded-lg border border-slate-800 p-4 font-mono text-xs overflow-auto">
                <div className="flex flex-col gap-6">
                  {/* Mock Parent */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                    <div className="p-2 border border-slate-800 bg-slate-900 rounded-md">
                      <span className="text-slate-500 mr-2">1024</span>
                      <span className="text-slate-300 italic">explorer.exe</span>
                    </div>
                  </div>
                  
                  {/* Current Alerted Process */}
                  <div className="flex items-center gap-2 ml-8 relative">
                    <div className="absolute -top-4 left-0 h-4 w-px bg-slate-700"></div>
                    <div className="absolute -top-4 left-0 w-2 h-px bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <div className="p-3 border border-rose-500/50 bg-rose-500/10 rounded-md ring-2 ring-rose-500/20">
                      <span className="text-rose-400 mr-2">{selectedAlert.processId}</span>
                      <span className="text-rose-100 font-bold underline decoration-rose-500/40">{selectedAlert.processName}</span>
                    </div>
                    <div className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest animate-bounce">TRIGGER</div>
                  </div>

                  {/* Child Process Mock */}
                  <div className="flex items-center gap-2 ml-16 relative">
                    <div className="absolute -top-12 left-0 h-12 w-px bg-slate-700"></div>
                    <div className="absolute top-0 left-0 w-2 h-px bg-slate-700"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                    <div className="p-2 border border-slate-800 bg-slate-900 rounded-md opacity-60">
                      <span className="text-slate-500 mr-2">8840</span>
                      <span className="text-slate-300 italic">conhost.exe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Command Inspector */}
            <div className={`${COLORS.panel} border ${COLORS.border} rounded-xl p-6 flex flex-col`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Hash size={16} className="text-emerald-500" />
                  Command Line Inspector
                </h4>
                <button className="text-xs text-emerald-500 flex items-center gap-1 hover:underline">
                  <Info size={12} /> Decode Base64
                </button>
              </div>
              <div className="flex-1 bg-slate-950/80 rounded-lg p-4 font-mono text-sm leading-relaxed overflow-y-auto border border-slate-800 text-emerald-400 shadow-inner">
                {selectedAlert.commandLine}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Case Management Sidebar */}
      <div className={`w-96 flex-shrink-0 ${COLORS.panel} border ${COLORS.border} rounded-xl flex flex-col overflow-hidden`}>
        <div className="p-5 border-b border-slate-800">
          <h3 className="font-bold flex items-center gap-2">
            <FolderKanban size={18} className="text-emerald-500" /> Case Management
          </h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Incident: LOTL-2024-MAY-012</p>
        </div>

        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveCaseTab('notes')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeCaseTab === 'notes' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Notes
          </button>
          <button 
            onClick={() => setActiveCaseTab('artifacts')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeCaseTab === 'artifacts' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Artifacts
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeCaseTab === 'notes' ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 animate-in fade-in slide-in-from-right-2 duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[10px] font-bold ${note.isSystem ? 'text-sky-500' : 'text-emerald-500'}`}>
                        {note.author}
                      </span>
                      <span className="text-[10px] text-slate-500">{note.timestamp}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${note.isSystem ? 'text-slate-400 italic' : 'text-slate-300'}`}>
                      {note.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <textarea 
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handlePostNote();
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs focus:outline-none focus:border-emerald-500 min-h-[100px] text-slate-200"
                  placeholder="Add analyst note..."
                ></textarea>
                <button 
                  onClick={handlePostNote}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Send size={14} /> POST NOTE
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
               <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tracked Artifacts</span>
                <span className="text-[10px] text-slate-400">{artifacts.length} Total</span>
              </div>
              
              <button 
                onClick={handleUploadArtifact}
                className="mb-4 w-full flex items-center justify-center gap-2 bg-emerald-600/10 border border-emerald-500/50 text-emerald-500 hover:bg-emerald-600 hover:text-white py-3 rounded-lg text-xs font-bold transition-all shadow-sm group"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" /> 
                UPLOAD NEW FORENSIC ARTIFACT
              </button>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {artifacts.map((art) => (
                  <div key={art.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg animate-in fade-in slide-in-from-right-2 duration-300 group hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-xs font-medium truncate flex-1 text-slate-200">{art.name}</span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-500 break-all bg-slate-900 p-2 rounded border border-slate-800">
                      {art.hash}
                    </div>
                  </div>
                ))}
                {artifacts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-600 italic">No artifacts identified yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-800/30 border-t border-slate-800 flex items-center gap-3">
           <button className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-2 rounded text-xs font-bold transition-colors">
            <UserPlus size={14} /> Assign
           </button>
           <button className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 py-2 rounded text-xs font-bold text-white transition-colors">
            Close Case
           </button>
        </div>
      </div>
    </div>
  );
};

export default AnalystPanel;
