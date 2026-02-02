export interface PythonFile {
  id: string;
  name: string;
  content: string;
  path: string;
}

export interface AnalysisIssue {
  id: string;
  fileId: string;
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestedFix?: string;
}

export interface ProjectState {
  files: PythonFile[];
  activeFileId: string | null;
  issues: AnalysisIssue[];
  isAnalyzing: boolean;
}

export interface DependencyNode {
  id: string;
  type: 'module' | 'function' | 'class';
}

export interface DependencyLink {
  source: string;
  target: string;
}

// AI Provider Types
export type AIProviderType = 'gemini' | 'openai' | 'mistral' | 'openrouter' | 'qwen' | 'zai';

export interface AIProviderConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  options?: Record<string, any>;
}

export interface AIProvider {
  id: AIProviderType;
  name: string;
  config: AIProviderConfig;
  analyzeCode: (code: string, context?: string) => Promise<any>;
  fixCode: (code: string, issue: AnalysisIssue) => Promise<string>;
  formatCode: (code: string) => Promise<string>;
}

export interface AIService {
  initializeProvider: (providerType: AIProviderType, config: AIProviderConfig) => void;
  analyzeProjectCode: (files: PythonFile[]) => Promise<{ issues: AnalysisIssue[], summary: string }>;
  applySmartFix: (file: PythonFile, issue: AnalysisIssue) => Promise<string>;
  formatPythonCode: (content: string) => Promise<string>;
}