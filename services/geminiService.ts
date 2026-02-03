
import { aiService } from './aiService';
import { PythonFile, AnalysisIssue, AIProviderType } from '../types';

// Re-export aiService functions for backward compatibility
// Note: Initialization is handled in App.tsx to avoid duplicate initialization

export async function analyzeProjectCode(files: PythonFile[]): Promise<{ issues: AnalysisIssue[], summary: string }> {
  return aiService.analyzeProjectCode(files);
}

export async function applySmartFix(file: PythonFile, issue: AnalysisIssue): Promise<string> {
  return aiService.applySmartFix(file, issue);
}

export async function formatPythonCode(content: string): Promise<string> {
  return aiService.formatPythonCode(content);
}

// Export the AI service for direct use
export { aiService };
