
import React, { useMemo } from 'react';
import { PythonFile } from '../types';

interface EditorProps {
  file: PythonFile | null;
  onChange: (id: string, content: string) => void;
  showDependencies: boolean;
}

const Editor: React.FC<EditorProps> = ({ file, onChange, showDependencies }) => {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-600 font-mono text-sm">
        <div className="text-center">
          <p>Select a file to begin structural analysis</p>
          <p className="text-xs opacity-50 mt-2">CTRL + P to search files</p>
        </div>
      </div>
    );
  }

  const lines = file.content.split('\n');

  // Simple heuristic for dependency highlighting
  const highlightedContent = useMemo(() => {
    if (!showDependencies) return file.content;

    const pythonKeywords = /\b(def|class|import|from|as|if|else|elif|for|while|return|try|except|with|in|is|not|and|or|lambda|None|True|False)\b/g;
    const imports = /\b(import|from)\s+([a-zA-Z0-9._]+)/g;
    
    let text = file.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Highlight imports/dependencies specifically
    text = text.replace(imports, (match, p1, p2) => {
      return `<span class="text-emerald-400 font-bold underline decoration-emerald-400/30">${p1}</span> <span class="text-blue-300 font-bold">${p2}</span>`;
    });

    // General keywords
    text = text.replace(pythonKeywords, '<span class="text-blue-400">$1</span>');
    
    // Comments
    text = text.replace(/(#.*)/g, '<span class="text-slate-600 italic">$1</span>');

    return text;
  }, [file.content, showDependencies]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-blue-400">{file.path}</span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">UTF-8</span>
          {showDependencies && (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">DEP_SCAN_ACTIVE</span>
          )}
        </div>
        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
          {lines.length} Lines
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line Numbers */}
        <div className="bg-slate-900/30 text-slate-600 font-mono text-xs p-4 pr-2 text-right select-none border-r border-slate-800/50 w-12 z-20">
          {lines.map((_, i) => (
            <div key={i} className="h-6 leading-6">{i + 1}</div>
          ))}
        </div>
        
        {/* Code Container */}
        <div className="flex-1 relative overflow-auto custom-scrollbar">
          {/* Highlight Layer */}
          <pre 
            className="absolute top-0 left-0 w-full h-full p-4 m-0 font-mono text-sm leading-6 pointer-events-none whitespace-pre z-0 text-transparent"
            dangerouslySetInnerHTML={{ __html: highlightedContent + '\n\n' }}
          />
          
          {/* Textarea Layer */}
          <textarea
            className={`absolute top-0 left-0 w-full h-full bg-transparent font-mono text-sm p-4 leading-6 resize-none focus:outline-none z-10 whitespace-pre overflow-hidden spellcheck-false caret-blue-500 ${showDependencies ? 'text-slate-300/40' : 'text-slate-300'}`}
            spellCheck={false}
            value={file.content}
            onChange={(e) => onChange(file.id, e.target.value)}
            style={{ minHeight: `${lines.length * 24 + 100}px`, width: '100%' }}
          />
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border: 2px solid #0f172a; border-radius: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default Editor;
