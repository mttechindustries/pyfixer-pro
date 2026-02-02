import React, { useState } from 'react';
import { Search, Filter, Code, Bug, Zap, Shield, GitBranch, Database, Cpu } from 'lucide-react';
import { PythonFile, AnalysisIssue } from '../types';

interface AdvancedAnalysisPanelProps {
  files: PythonFile[];
  issues: AnalysisIssue[];
  isVisible: boolean;
  onRunAnalysis: () => void;
}

const AdvancedAnalysisPanel: React.FC<AdvancedAnalysisPanelProps> = ({ 
  files, 
  issues, 
  isVisible, 
  onRunAnalysis 
}) => {
  const [analysisType, setAnalysisType] = useState<'security' | 'performance' | 'duplication' | 'complexity'>('security');
  const [isRunning, setIsRunning] = useState(false);

  if (!isVisible) return null;

  const runSpecificAnalysis = async () => {
    setIsRunning(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRunning(false);
    onRunAnalysis();
  };

  const getAnalysisIcon = () => {
    switch(analysisType) {
      case 'security': return <Shield size={16} className="text-red-400" />;
      case 'performance': return <Cpu size={16} className="text-amber-400" />;
      case 'duplication': return <GitBranch size={16} className="text-cyan-400" />;
      case 'complexity': return <Code size={16} className="text-purple-400" />;
      default: return <Search size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-slate-300">Advanced Analysis</h3>
        </div>
        <div className="flex gap-2">
          <select 
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
          >
            <option value="security">Security</option>
            <option value="performance">Performance</option>
            <option value="duplication">Duplication</option>
            <option value="complexity">Complexity</option>
          </select>
          <button
            onClick={runSpecificAnalysis}
            disabled={isRunning}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-xs rounded disabled:opacity-50"
          >
            {isRunning ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Zap size={12} />
                Run
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-slate-800/30 p-3 rounded border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            {getAnalysisIcon()}
            <h4 className="text-xs font-medium text-slate-300 capitalize">
              {analysisType} Analysis
            </h4>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Performs deep analysis for {analysisType}-related issues in your codebase
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Files scanned:</span>
              <span className="text-slate-300">{files.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Lines analyzed:</span>
              <span className="text-slate-300">
                {files.reduce((sum, file) => sum + file.content.split('\n').length, 0)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Issues found:</span>
              <span className="text-slate-300">{issues.length}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/30 p-3 rounded border border-slate-700">
          <h4 className="text-xs font-medium text-slate-300 mb-2">Analysis Results</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {issues.slice(0, 5).map((issue, index) => (
              <div key={issue.id} className="text-xs p-2 bg-slate-900/50 rounded">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-300">{issue.message}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    issue.severity === 'error' ? 'bg-red-500/20 text-red-400' :
                    issue.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <div className="text-slate-500 mt-1">
                  {files.find(f => f.id === issue.fileId)?.name}:{issue.line}
                </div>
              </div>
            ))}
            {issues.length > 5 && (
              <div className="text-xs text-slate-500 text-center pt-2">
                +{issues.length - 5} more issues...
              </div>
            )}
            {issues.length === 0 && (
              <div className="text-xs text-slate-500 text-center py-2">
                No issues found in this category
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalysisPanel;