
import React from 'react';
import { AnalysisIssue, PythonFile } from '../types';
import { AlertTriangle, AlertCircle, Info, Zap, CheckCircle2 } from 'lucide-react';

interface AnalysisPanelProps {
  issues: AnalysisIssue[];
  files: PythonFile[];
  onApplyFix: (issue: AnalysisIssue) => void;
  isAnalyzing: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ issues, files, onApplyFix, isAnalyzing }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <AlertCircle size={14} className="text-red-400" />;
      case 'warning': return <AlertTriangle size={14} className="text-amber-400" />;
      case 'info': return <Info size={14} className="text-blue-400" />;
      default: return null;
    }
  };

  const getFileName = (fileId: string) => {
    return files.find(f => f.id === fileId)?.name || 'Unknown File';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 w-80 overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Diagnostics</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Running structural analysis...</p>
            <p className="text-xs opacity-60">Scanning for anti-patterns and circular dependencies.</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 p-8 text-center">
            <CheckCircle2 size={32} className="text-emerald-500/50 mb-2" />
            <p className="text-sm font-medium text-slate-300">Clean Architecture</p>
            <p className="text-xs">No critical issues detected in current workspace.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {issues.map(issue => (
              <div key={issue.id} className="p-3 hover:bg-slate-800/30 transition-colors group">
                <div className="flex items-start gap-2 mb-1">
                  {getSeverityIcon(issue.severity)}
                  <span className="text-xs font-mono text-slate-500">
                    {getFileName(issue.fileId)}:{issue.line}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-snug mb-3">
                  {issue.message}
                </p>
                {issue.suggestedFix && (
                  <button
                    onClick={() => onApplyFix(issue)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded shadow-lg transition-all"
                  >
                    <Zap size={12} fill="currentColor" />
                    APPLY SMART FIX
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">TOTAL ISSUES</span>
          <span className={`font-mono font-bold ${issues.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {issues.length}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${issues.length > 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(100, (issues.length / 10) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
