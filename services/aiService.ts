import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from 'openai';
import { PythonFile, AnalysisIssue, AIProvider, AIProviderType, AIProviderConfig, AIService } from "./types";
import { mockAIService, AIRequest } from "./mockAIService";

class AIFactory {
  private static providers: Map<AIProviderType, AIProvider> = new Map();

  static registerProvider(provider: AIProvider): void {
    this.providers.set(provider.id, provider);
  }

  static getProvider(type: AIProviderType): AIProvider | undefined {
    return this.providers.get(type);
  }
}

// Gemini Provider
const geminiProvider: AIProvider = {
  id: 'gemini',
  name: 'Gemini',
  config: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: 'gemini-1.5-pro-latest'
  },

  analyzeCode: async (code: string, context?: string) => {
    try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

      const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

      const prompt = `Analyze this Python code for bugs, architectural issues, and PEP8 violations. Return a structured JSON report.\n\nFILE CONTENT:\n${code}${context ? `\n\nCONTEXT:\n${context}` : ''}`;

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              issues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    fileName: { type: "string" },
                    line: { type: "number" },
                    severity: { type: "string", enum: ['error', 'warning', 'info'] },
                    message: { type: "string" },
                    suggestedFix: { type: "string" }
                  },
                  required: ['fileName', 'line', 'severity', 'message']
                }
              }
            },
            required: ['summary', 'issues']
          }
        }
      });

      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error("Gemini API error:", error);
      // Fallback to mock service
      return callAIApi('gemini', 'analyze', { code, context });
    }
  },

  fixCode: async (code: string, issue: AnalysisIssue) => {
    try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

      const prompt = `You are a Python expert. Fix the following issue in this file.
    Issue: ${issue.message} at line ${issue.line}.
    Suggested Fix Direction: ${issue.suggestedFix || 'Apply best practices'}

    CODE:
    ${code}

    Return ONLY the corrected full content of the file.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Gemini API error:", error);
      // Fallback to mock service
      return callAIApi('gemini', 'fix', { code, issue });
    }
  },

  formatCode: async (code: string) => {
    try {
      const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Reformat the following Python code to strictly adhere to PEP 8 standards, similar to what the 'black' formatter would do. Maintain all logic exactly as is.

    CODE:
    ${code}

    Return ONLY the formatted code content.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim().replace(/^```python\n/, '').replace(/\n```$/, '');
    } catch (error) {
      console.error("Gemini API error:", error);
      // Fallback to mock service
      return callAIApi('gemini', 'format', { code });
    }
  }
};

// OpenAI Provider
const openaiProvider: AIProvider = {
  id: 'openai',
  name: 'OpenAI',
  config: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4o'
  },

  analyzeCode: async (code: string, context?: string) => {
    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
        dangerouslyAllowBrowser: true
      });

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: "You are a Python code analyzer. Return responses in JSON format with 'summary' and 'issues' fields."
          },
          {
            role: "user",
            content: `Analyze this Python code for bugs, architectural issues, and PEP8 violations. Return a structured JSON report.\n\nFILE CONTENT:\n${code}${context ? `\n\nCONTEXT:\n${context}` : ''}`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fallback to mock service
      return callAIApi('openai', 'analyze', { code, context });
    }
  },

  fixCode: async (code: string, issue: AnalysisIssue) => {
    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
        dangerouslyAllowBrowser: true
      });

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: "You are a Python expert. Fix the provided code issue and return only the corrected code."
          },
          {
            role: "user",
            content: `You are a Python expert. Fix the following issue in this file.
    Issue: ${issue.message} at line ${issue.line}.
    Suggested Fix Direction: ${issue.suggestedFix || 'Apply best practices'}

    CODE:
    ${code}

    Return ONLY the corrected full content of the file.`
          }
        ]
      });

      return response.choices[0].message.content?.trim() || '';
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fallback to mock service
      return callAIApi('openai', 'fix', { code, issue });
    }
  },

  formatCode: async (code: string) => {
    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
        dangerouslyAllowBrowser: true
      });

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: "system",
            content: "You are a Python code formatter. Format the code according to PEP 8 standards."
          },
          {
            role: "user",
            content: `Reformat the following Python code to strictly adhere to PEP 8 standards, similar to what the 'black' formatter would do. Maintain all logic exactly as is.

    CODE:
    ${code}

    Return ONLY the formatted code content.`
          }
        ]
      });

      return response.choices[0].message.content?.trim() || '';
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fallback to mock service
      return callAIApi('openai', 'format', { code });
    }
  }
};

// Helper function to make API calls to a backend proxy
async function callAIApi(provider: AIProviderType, endpoint: string, data: any): Promise<any> {
  // In a real implementation, this would call a backend proxy to avoid CORS issues
  // For now, we'll use the mock service for demonstration purposes
  const request: AIRequest = {
    provider,
    endpoint,
    data
  };
  
  const response = await mockAIService(request);
  
  if (!response.success) {
    throw new Error(response.error || `Error calling ${provider} API`);
  }
  
  return response.data;
}

// Mistral Provider
const mistralProvider: AIProvider = {
  id: 'mistral',
  name: 'Mistral',
  config: {
    apiKey: process.env.MISTRAL_API_KEY || '',
    model: 'mistral-large-latest'
  },
  
  analyzeCode: async (code: string, context?: string) => {
    return callAIApi('mistral', 'analyze', { code, context });
  },

  fixCode: async (code: string, issue: AnalysisIssue) => {
    return callAIApi('mistral', 'fix', { code, issue });
  },

  formatCode: async (code: string) => {
    return callAIApi('mistral', 'format', { code });
  }
};

// OpenRouter Provider
const openrouterProvider: AIProvider = {
  id: 'openrouter',
  name: 'OpenRouter',
  config: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    model: 'openrouter/auto',
    baseUrl: 'https://openrouter.ai/api/v1'
  },
  
  analyzeCode: async (code: string, context?: string) => {
    return callAIApi('openrouter', 'analyze', { code, context });
  },

  fixCode: async (code: string, issue: AnalysisIssue) => {
    return callAIApi('openrouter', 'fix', { code, issue });
  },

  formatCode: async (code: string) => {
    return callAIApi('openrouter', 'format', { code });
  }
};

// Qwen Provider
const qwenProvider: AIProvider = {
  id: 'qwen',
  name: 'Qwen',
  config: {
    apiKey: process.env.QWEN_API_KEY || '',
    model: 'qwen-max'
  },
  
  analyzeCode: async (code: string, context?: string) => {
    return callAIApi('qwen', 'analyze', { code, context });
  },

  fixCode: async (code: string, issue: AnalysisIssue) => {
    return callAIApi('qwen', 'fix', { code, issue });
  },

  formatCode: async (code: string) => {
    return callAIApi('qwen', 'format', { code });
  }
};

// Z.AI Provider
const zaiProvider: AIProvider = {
  id: 'zai',
  name: 'Z.AI',
  config: {
    apiKey: process.env.ZAI_API_KEY || '',
    model: 'zai-v1'
  },
  
  analyzeCode: async (code: string, context?: string) => {
    return callAIApi('zai', 'analyze', { code, context });
  },

  fixCode: async (code: string, issue: AnalysisIssue) => {
    return callAIApi('zai', 'fix', { code, issue });
  },

  formatCode: async (code: string) => {
    return callAIApi('zai', 'format', { code });
  }
};

// Register all providers
AIFactory.registerProvider(geminiProvider);
AIFactory.registerProvider(openaiProvider);
AIFactory.registerProvider(mistralProvider);
AIFactory.registerProvider(openrouterProvider);
AIFactory.registerProvider(qwenProvider);
AIFactory.registerProvider(zaiProvider);

class AIServiceImpl implements AIService {
  private currentProvider: AIProvider | null = null;

  initializeProvider(providerType: AIProviderType, config: AIProviderConfig): void {
    const provider = AIFactory.getProvider(providerType);
    if (provider) {
      this.currentProvider = {
        ...provider,
        config: { ...provider.config, ...config }
      };
    } else {
      throw new Error(`Provider ${providerType} not found`);
    }
  }

  async analyzeProjectCode(files: PythonFile[]): Promise<{ issues: AnalysisIssue[], summary: string }> {
    if (!this.currentProvider) {
      throw new Error('No AI provider initialized');
    }

    const projectContext = files.map(f => `FILE: ${f.path}\nCONTENT:\n${f.content}`).join("\n\n---\n\n");
    
    try {
      const result = await this.currentProvider.analyzeCode(projectContext);
      
      const issues: AnalysisIssue[] = result.issues.map((issue: any, index: number) => {
        const file = files.find(f => f.path === issue.fileName || f.name === issue.fileName);
        return {
          id: `issue-${Date.now()}-${index}`,
          fileId: file?.id || 'unknown',
          line: issue.line,
          severity: issue.severity,
          message: issue.message,
          suggestedFix: issue.suggestedFix
        };
      });
      
      return { issues, summary: result.summary };
    } catch (error) {
      console.error("Analysis failed:", error);
      return { issues: [], summary: "Analysis failed." };
    }
  }

  async applySmartFix(file: PythonFile, issue: AnalysisIssue): Promise<string> {
    if (!this.currentProvider) {
      throw new Error('No AI provider initialized');
    }

    try {
      return await this.currentProvider.fixCode(file.content, issue);
    } catch (error) {
      console.error("Fix application failed:", error);
      throw error;
    }
  }

  async formatPythonCode(content: string): Promise<string> {
    if (!this.currentProvider) {
      throw new Error('No AI provider initialized');
    }

    try {
      return await this.currentProvider.formatCode(content);
    } catch (error) {
      console.error("Code formatting failed:", error);
      throw error;
    }
  }
}

export const aiService = new AIServiceImpl();