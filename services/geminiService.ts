
import { aiService } from './aiService';
import { PythonFile, AnalysisIssue, AIProviderType } from '../types';

// Initialize with Gemini as default provider
aiService.initializeProvider('gemini', {
  apiKey: process.env.GEMINI_API_KEY || ''
});

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
