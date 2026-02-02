import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Zap, Shield, TrendingUp, Calendar, Clock } from 'lucide-react';
import { PythonFile } from '../types';

interface CodeMetrics {
  complexity: number;
  maintainability: number;
  duplication: number;
  securityIssues: number;
  performanceScore: number;
  lastAnalyzed: Date;
}

interface CodeMetricsPanelProps {
  files: PythonFile[];
  isVisible: boolean;
}

const CodeMetricsPanel: React.FC<CodeMetricsPanelProps> = ({ files, isVisible }) => {
  const [metrics, setMetrics] = useState<CodeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate metrics based on the files
  useEffect(() => {
    if (!isVisible || files.length === 0) return;

    setIsLoading(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      // Calculate metrics based on file content
      let totalComplexity = 0;
      let totalLines = 0;
      let securityIssues = 0;
      
      files.forEach(file => {
        const lines = file.content.split('\n');
        totalLines += lines.length;
        
        // Simple complexity estimation based on keywords
        const complexityFactors = ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'try', 'except'];
        let fileComplexity = 0;
        
        lines.forEach(line => {
          complexityFactors.forEach(factor => {
            if (line.includes(factor)) {
              fileComplexity++;
            }
          });
          
          // Check for potential security issues
          if (line.includes('eval(') || line.includes('exec(') || line.includes('os.system')) {
            securityIssues++;
          }
        });
        
        totalComplexity += fileComplexity;
      });
      
      const avgComplexity = totalLines > 0 ? totalComplexity / files.length : 0;
      const maintainability = Math.max(0, 100 - (avgComplexity * 2));
      const duplication = Math.min(100, (totalLines / 10) * 0.5); // Simplified calculation
      
      setMetrics({
        complexity: Math.min(100, avgComplexity * 5),
        maintainability: maintainability,
        duplication: duplication,
        securityIssues: securityIssues,
        performanceScore: Math.max(0, 100 - (securityIssues * 10)),
        lastAnalyzed: new Date()
      });
      
      setIsLoading(false);
    }, 800);
  }, [files, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-300">Code Metrics</h3>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={14} className="text-purple-400" />
              <span className="text-xs text-slate-400">Complexity</span>
            </div>
            <div className="text-lg font-bold text-slate-200">{metrics.complexity}/100</div>
            <div className={`text-xs ${metrics.complexity > 70 ? 'text-amber-400' : metrics.complexity > 40 ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {metrics.complexity > 70 ? 'High' : metrics.complexity > 40 ? 'Medium' : 'Low'}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-amber-400" />
              <span className="text-xs text-slate-400">Maintainability</span>
            </div>
            <div className="text-lg font-bold text-slate-200">{metrics.maintainability}/100</div>
            <div className={`text-xs ${metrics.maintainability > 70 ? 'text-emerald-400' : metrics.maintainability > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {metrics.maintainability > 70 ? 'Good' : metrics.maintainability > 40 ? 'Fair' : 'Poor'}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-cyan-400" />
              <span className="text-xs text-slate-400">Duplication</span>
            </div>
            <div className="text-lg font-bold text-slate-200">{metrics.duplication.toFixed(1)}%</div>
            <div className={`text-xs ${metrics.duplication > 10 ? 'text-red-400' : metrics.duplication > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {metrics.duplication > 10 ? 'High' : metrics.duplication > 5 ? 'Medium' : 'Low'}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} className="text-red-400" />
              <span className="text-xs text-slate-400">Security</span>
            </div>
            <div className="text-lg font-bold text-slate-200">{metrics.securityIssues}</div>
            <div className={`text-xs ${metrics.securityIssues > 5 ? 'text-red-400' : metrics.securityIssues > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {metrics.securityIssues > 5 ? 'Critical' : metrics.securityIssues > 0 ? 'Warning' : 'Safe'}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-green-400" />
              <span className="text-xs text-slate-400">Performance</span>
            </div>
            <div className="text-lg font-bold text-slate-200">{metrics.performanceScore}/100</div>
            <div className={`text-xs ${metrics.performanceScore > 80 ? 'text-emerald-400' : metrics.performanceScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {metrics.performanceScore > 80 ? 'Excellent' : metrics.performanceScore > 50 ? 'Good' : 'Needs Work'}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-blue-400" />
              <span className="text-xs text-slate-400">Last Scan</span>
            </div>
            <div className="text-sm font-bold text-slate-200">Just now</div>
            <div className="text-xs text-slate-500">
              {metrics.lastAnalyzed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
          <p>Analyze code to see metrics</p>
        </div>
      )}
    </div>
  );
};

export default CodeMetricsPanel;