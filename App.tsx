
import React, { useState, useCallback, useEffect } from 'react';
import FileExplorer from './components/FileExplorer';
import Editor from './components/Editor';
import AnalysisPanel from './components/AnalysisPanel';
import DependencyMap from './components/DependencyMap';
import SettingsPanel from './components/SettingsPanel';
import CodeMetricsPanel from './components/CodeMetricsPanel';
import AIProviderStatusPanel from './components/AIProviderStatusPanel';
import AdvancedAnalysisPanel from './components/AdvancedAnalysisPanel';
import CodeSuggestionsPanel from './components/CodeSuggestionsPanel';
import { PythonFile, AnalysisIssue, ProjectState, AIProviderType } from './types';
import { analyzeProjectCode, applySmartFix, formatPythonCode, aiService } from './services/geminiService';
import { Play, Bug, Wand2, Zap, Settings as SettingsIcon, Command, Eye, Cpu, BarChart3, Brain, Search, Lightbulb } from 'lucide-react';

const INITIAL_CODE = `import sys
import os

class DataProcessor:
    def __init__(self, data):
        self.data = data

    def process_items(self):
        # Intentional bug: missing self and logic error
        results = []
        for item in data:
            results.append(item * 2)
        return results

if __name__ == "__main__":
    proc = DataProcessor([1, 2, 3])
    print(proc.process_items())
`;

const App: React.FC = () => {
  const [state, setState] = useState<ProjectState>({
    files: [
      { id: '1', name: 'main.py', content: INITIAL_CODE, path: 'main.py' },
      { id: '2', name: 'utils.py', content: 'import math\n\ndef calculate_dist(x, y):\n    return math.sqrt(x**2 + y**2)', path: 'utils.py' }
    ],
    activeFileId: '1',
    issues: [],
    isAnalyzing: false
  });

  const [showDependencies, setShowDependencies] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showProviderStatus, setShowProviderStatus] = useState(false);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [showCodeSuggestions, setShowCodeSuggestions] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<AIProviderType>('gemini');
  const [apiKeys, setApiKeys] = useState<Record<AIProviderType, string>>({
    gemini: process.env.GEMINI_API_KEY || '',
    openai: process.env.OPENAI_API_KEY || '',
    mistral: process.env.MISTRAL_API_KEY || '',
    openrouter: process.env.OPENROUTER_API_KEY || '',
    qwen: process.env.QWEN_API_KEY || '',
    zai: process.env.ZAI_API_KEY || ''
  });

  const activeFile = state.files.find(f => f.id === state.activeFileId) || null;

  // Initialize the AI service with the selected provider
  useEffect(() => {
    aiService.initializeProvider(currentProvider, {
      apiKey: apiKeys[currentProvider] || ''
    });
  }, [currentProvider, apiKeys]);

  const handleFileChange = useCallback((id: string, content: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(f => f.id === id ? { ...f, content } : f)
    }));
  }, []);

  const handleSelectFile = useCallback((id: string) => {
    setState(prev => ({ ...prev, activeFileId: id }));
  }, []);

  const handleAddFile = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newFile: PythonFile = {
      id: newId,
      name: `new_script_${state.files.length + 1}.py`,
      content: '# New Python Script\n',
      path: `new_script_${state.files.length + 1}.py`
    };
    setState(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      activeFileId: newId
    }));
  }, [state.files.length]);

  const handleDeleteFile = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== id),
      activeFileId: prev.activeFileId === id ? (prev.files[0]?.id || null) : prev.activeFileId
    }));
  }, []);

  const triggerAnalysis = async () => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const result = await analyzeProjectCode(state.files);
      setState(prev => ({
        ...prev,
        issues: result.issues,
        isAnalyzing: false
      }));
    } catch (error) {
      console.error("Analysis failed:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleFormat = async () => {
    if (!activeFile) return;
    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const formatted = await formatPythonCode(activeFile.content);
      handleFileChange(activeFile.id, formatted);
    } catch (error) {
      console.error("Format failed", error);
    } finally {
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleApplyFix = async (issue: AnalysisIssue) => {
    const file = state.files.find(f => f.id === issue.fileId);
    if (!file) return;

    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const newContent = await applySmartFix(file, issue);
      handleFileChange(file.id, newContent);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        issues: prev.issues.filter(i => i.id !== issue.id)
      }));
    } catch (error) {
      console.error("Fix application failed:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleProviderChange = (provider: AIProviderType) => {
    setCurrentProvider(provider);
  };

  const handleApiKeyChange = (provider: AIProviderType, key: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: key
    }));
  };

  const handleSaveSettings = () => {
    aiService.initializeProvider(currentProvider, {
      apiKey: apiKeys[currentProvider] || ''
    });
    setShowSettings(false);
  };

  // Import/Upload functionality
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newId = Math.random().toString(36).substr(2, 9);
        const newFile: PythonFile = {
          id: newId,
          name: file.name,
          content: content,
          path: file.name
        };

        setState(prev => ({
          ...prev,
          files: [...prev.files, newFile],
          activeFileId: newId
        }));
      };
      reader.readAsText(file);
    });

    // Reset the input
    event.target.value = '';
  };

  // Export functionality
  const handleExportProject = () => {
    const projectData = {
      files: state.files,
      createdAt: new Date().toISOString(),
      exportedBy: 'MT Tech Industries LLC',
      version: '2026.1.0'
    };

    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pyfixer-pro-project-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://github.com/mttechindustries/mttechindustries.github.io/blob/main/mtlogodark.webp?raw=true"
              alt="MT Tech Industries Logo"
              className="w-6 h-6 object-contain"
            />
            <h1 className="font-bold text-sm tracking-tighter">PYFIXER<span className="text-blue-500">PRO</span></h1>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex gap-2">
            <button
              onClick={triggerAnalysis}
              disabled={state.isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded transition-all border border-slate-700 disabled:opacity-50"
            >
              <Bug size={14} className="text-blue-400" />
              ANALYZE
            </button>
            <button
              onClick={handleFormat}
              disabled={state.isAnalyzing || !activeFile}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded transition-all border border-slate-700 disabled:opacity-50"
            >
              <Wand2 size={14} className="text-emerald-400" />
              FORMAT (PEP8)
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-semibold rounded transition-all shadow-lg shadow-blue-900/20">
              <Play size={14} fill="currentColor" />
              RUN
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-2">
             <button
                onClick={() => setShowDependencies(!showDependencies)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all border ${showDependencies ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <Eye size={12} />
                DEPS
              </button>

              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all border ${showMetrics ? 'bg-purple-600/20 border-purple-500/50 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <BarChart3 size={12} />
                METRICS
              </button>

              <button
                onClick={() => setShowProviderStatus(!showProviderStatus)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all border ${showProviderStatus ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <Brain size={12} />
                PROVIDERS
              </button>

              <button
                onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all border ${showAdvancedAnalysis ? 'bg-amber-600/20 border-amber-500/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <Search size={12} />
                ADVANCED
              </button>

              <button
                onClick={() => setShowCodeSuggestions(!showCodeSuggestions)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all border ${showCodeSuggestions ? 'bg-amber-500/20 border-amber-400/50 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <Lightbulb size={12} />
                SUGGESTIONS
              </button>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded transition-all border border-slate-700"
            >
              <span className="hidden sm:inline">UPLOAD</span>
              <span className="sm:hidden">UP</span>
            </button>

            <button
              onClick={handleExportProject}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded transition-all border border-slate-700"
            >
              <span className="hidden sm:inline">EXPORT</span>
              <span className="sm:hidden">EXP</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <div className="flex items-center gap-1">
              <Cpu size={12} className="text-blue-400" />
              <span className="text-[10px] font-mono capitalize">{currentProvider}</span>
            </div>
            <div className="flex items-center gap-1">
              <Command size={12} />
              <span className="text-[10px] font-mono">S: SAVE</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SettingsIcon
              onClick={() => setShowSettings(true)}
              className="text-slate-600 cursor-pointer hover:text-slate-400 transition-colors"
              size={18}
            />
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <img
                src="https://github.com/mttechindustries/mttechindustries.github.io/blob/main/mtlogodark.webp?raw=true"
                alt="MT Tech Industries Logo"
                className="w-4 h-4 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentProvider={currentProvider}
        onProviderChange={handleProviderChange}
        apiKeys={apiKeys}
        onApiKeyChange={handleApiKeyChange}
        onSave={handleSaveSettings}
      />

      <div className="flex flex-1 pt-12 pb-8">
        <FileExplorer
          files={state.files}
          activeFileId={state.activeFileId}
          onSelectFile={handleSelectFile}
          onAddFile={handleAddFile}
          onDeleteFile={handleDeleteFile}
        />

        <main className="flex-1 flex flex-col min-w-0">
          <Editor
            file={activeFile}
            onChange={handleFileChange}
            showDependencies={showDependencies}
          />

          {/* Bottom Panel/Terminal area */}
          <div className="h-64 bg-slate-900/50 border-t border-slate-800 p-4 overflow-hidden">
             <div className="flex gap-4 h-full">
                <div className="flex-1 flex flex-col">
                  <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Terminal Output
                  </h3>
                  <div className="flex-1 bg-black/40 rounded p-3 font-mono text-xs text-slate-400 overflow-y-auto whitespace-pre custom-scrollbar">
                    {`$ python3 main.py\nTraceback (most recent call last):\n  File "main.py", line 14, in <module>\n    print(proc.process_items())\n  File "main.py", line 10, in process_items\n    for item in data:\nNameError: name 'data' is not defined. Did you mean: 'self.data'?\n\nProcess finished with exit code 1.`}
                  </div>
                </div>

                <div className="w-80">
                  {showDependencies && (
                    <DependencyMap
                      files={state.files}
                      activeFileId={state.activeFileId}
                      onNodeClick={handleSelectFile}
                    />
                  )}

                  {showMetrics && (
                    <CodeMetricsPanel
                      files={state.files}
                      isVisible={showMetrics}
                    />
                  )}

                  {showProviderStatus && (
                    <AIProviderStatusPanel
                      currentProvider={currentProvider}
                      isVisible={showProviderStatus}
                    />
                  )}

                  {!showDependencies && !showMetrics && !showProviderStatus && showAdvancedAnalysis && (
                    <AdvancedAnalysisPanel
                      files={state.files}
                      issues={state.issues}
                      isVisible={showAdvancedAnalysis}
                      onRunAnalysis={triggerAnalysis}
                    />
                  )}

                  {!showDependencies && !showMetrics && !showProviderStatus && !showAdvancedAnalysis && showCodeSuggestions && (
                    <CodeSuggestionsPanel
                      files={state.files}
                      isVisible={showCodeSuggestions}
                      onApplySuggestion={(suggestion) => {
                        // Placeholder for applying suggestions
                        console.log("Applying suggestion:", suggestion);
                      }}
                    />
                  )}
                </div>
             </div>
          </div>
        </main>

        <AnalysisPanel
          issues={state.issues}
          files={state.files}
          onApplyFix={handleApplyFix}
          isAnalyzing={state.isAnalyzing}
        />
      </div>

      {/* Footer with MT Tech Industries LLC branding */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-900/80 border-t border-slate-800 flex items-center justify-center text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <img
            src="https://github.com/mttechindustries/mttechindustries.github.io/blob/main/mtlogodark.webp?raw=true"
            alt="MT Tech Industries Logo"
            className="w-4 h-4 object-contain"
          />
          <span className="font-medium text-slate-400">MT Tech Industries LLC</span>
          <span>•</span>
          <span>v2026.1.0</span>
        </div>
      </div>

      {/* Additional Panels - Modal-style overlays when not shown in sidebar */}
      {showAdvancedAnalysis && (showDependencies || showMetrics || showProviderStatus) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-4xl h-5/6 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-200">Advanced Analysis</h2>
              <button
                onClick={() => setShowAdvancedAnalysis(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <AdvancedAnalysisPanel
                files={state.files}
                issues={state.issues}
                isVisible={showAdvancedAnalysis}
                onRunAnalysis={triggerAnalysis}
              />
            </div>
          </div>
        </div>
      )}

      {showCodeSuggestions && (showDependencies || showMetrics || showProviderStatus || showAdvancedAnalysis) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-4xl h-5/6 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-200">Code Suggestions</h2>
              <button
                onClick={() => setShowCodeSuggestions(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <CodeSuggestionsPanel
                files={state.files}
                isVisible={showCodeSuggestions}
                onApplySuggestion={(suggestion) => {
                  // Placeholder for applying suggestions
                  console.log("Applying suggestion:", suggestion);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for upload */}
      <input
        id="file-upload"
        type="file"
        accept=".py,.txt,.json,.js,.ts,.jsx,.tsx"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default App;
