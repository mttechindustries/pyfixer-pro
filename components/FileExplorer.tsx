
import React from 'react';
import { PythonFile } from '../types';
import { FileCode, Folder, Plus, Trash2 } from 'lucide-react';

interface FileExplorerProps {
  files: PythonFile[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onAddFile: () => void;
  onDeleteFile: (id: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  activeFileId, 
  onSelectFile, 
  onAddFile, 
  onDeleteFile 
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Explorer</h2>
        <button 
          onClick={onAddFile}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center gap-2 px-2 py-1 text-slate-400 text-sm mb-2">
          <Folder size={14} />
          <span>src/</span>
        </div>
        
        <div className="space-y-1">
          {files.map(file => (
            <div
              key={file.id}
              className={`group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-all ${
                activeFileId === file.id 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' 
                  : 'hover:bg-slate-800/50 text-slate-400'
              }`}
              onClick={() => onSelectFile(file.id)}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode size={14} className={activeFileId === file.id ? 'text-blue-400' : 'text-slate-500'} />
                <span className="text-sm truncate">{file.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(file.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="text-[10px] text-slate-600 font-mono">
          PROJECT: LOCAL_ENV
          <br />
          LANG: PYTHON 3.12
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
