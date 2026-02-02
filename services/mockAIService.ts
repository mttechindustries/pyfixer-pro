// Mock backend API for AI providers
// In a real implementation, this would be a separate backend service

export interface AIRequest {
  provider: string;
  endpoint: string;
  data: any;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Mock implementations for AI providers
export async function mockAIService(request: AIRequest): Promise<AIResponse> {
  const { provider, endpoint, data } = request;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    switch (provider) {
      case 'gemini':
        return await mockGeminiService(endpoint, data);
      case 'openai':
        return await mockOpenAIService(endpoint, data);
      case 'mistral':
        return await mockMistralService(endpoint, data);
      case 'openrouter':
        return await mockOpenRouterService(endpoint, data);
      case 'qwen':
        return await mockQwenService(endpoint, data);
      case 'zai':
        return await mockZaiService(endpoint, data);
      default:
        return {
          success: false,
          error: `Unsupported provider: ${provider}`
        };
    }
  } catch (error) {
    return {
      success: false,
      error: `Error calling ${provider}: ${(error as Error).message}`
    };
  }
}

// Mock Gemini service
async function mockGeminiService(endpoint: string, data: any): Promise<AIResponse> {
  switch (endpoint) {
    case 'analyze':
      return {
        success: true,
        data: {
          summary: "Mock Gemini analysis completed",
          issues: [
            {
              fileName: "main.py",
              line: 10,
              severity: "error",
              message: "Variable 'data' is not defined",
              suggestedFix: "Use 'self.data' instead of 'data'"
            }
          ]
        }
      };
    case 'fix':
      return {
        success: true,
        data: data.code.replace(/data:/g, 'self.data:') // Simplified mock fix
      };
    case 'format':
      return {
        success: true,
        data: data.code // Return formatted code
      };
    default:
      return { success: false, error: "Invalid endpoint" };
  }
}

// Mock OpenAI service
async function mockOpenAIService(endpoint: string, data: any): Promise<AIResponse> {
  switch (endpoint) {
    case 'analyze':
      return {
        success: true,
        data: {
          summary: "Mock OpenAI analysis completed",
          issues: [
            {
              fileName: "main.py",
              line: 10,
              severity: "warning",
              message: "Consider using list comprehension for better performance",
              suggestedFix: "Replace loop with list comprehension"
            }
          ]
        }
      };
    case 'fix':
      return {
        success: true,
        data: data.code // Return fixed code
      };
    case 'format':
      return {
        success: true,
        data: data.code // Return formatted code
      };
    default:
      return { success: false, error: "Invalid endpoint" };
  }
}

// Mock Mistral service
async function mockMistralService(endpoint: string, data: any): Promise<AIResponse> {
  switch (endpoint) {
    case 'analyze':
      return {
        success: true,
        data: {
          summary: "Mock Mistral analysis completed",
          issues: [
            {
              fileName: "main.py",
              line: 5,
              severity: "info",
              message: "Consider adding type hints for better readability",
              suggestedFix: "Add type annotations to function parameters"
            }
          ]
        }
      };
    case 'fix':
      return {
        success: true,
        data: data.code // Return fixed code
      };
    case 'format':
      return {
        success: true,
        data: data.code // Return formatted code
      };
    default:
      return { success: false, error: "Invalid endpoint" };
  }
}

// Mock OpenRouter service
async function mockOpenRouterService(endpoint: string, data: any): Promise<AIResponse> {
  switch (endpoint) {
    case 'analyze':
      return {
        success: true,
        data: {
          summary: "Mock OpenRouter analysis completed",
          issues: [
            {
              fileName: "utils.py",
              line: 3,
              severity: "error",
              message: "Missing docstring for public function",
              suggestedFix: "Add docstring explaining function purpose"
            }
          ]
        }
      };
    case 'fix':
      return {
        success: true,
        data: data.code // Return fixed code
      };
    case 'format':
      return {
        success: true,
        data: data.code // Return formatted code
      };
    default:
      return { success: false, error: "Invalid endpoint" };
  }
}

// Mock Qwen service
async function mockQwenService(endpoint: string, data: any): Promise<AIResponse> {
  switch (endpoint) {
    case 'analyze':
      return {
        success: true,
        data: {
          summary: "Mock Qwen analysis completed",
          issues: [
            {
              fileName: "main.py",
              line: 1,
              severity: "warning",
              message: "Unused import detected",
              suggestedFix: "Remove unused import"
            }
          ]
        }
      };
    case 'fix':
      return {
        success: true,
        data: data.code // Return fixed code
      };
    case 'format':
      return {
        success: true,
        data: data.code // Return formatted code
      };
    default:
      return { success: false, error: "Invalid endpoint" };
  }
}

// Mock Z.AI service
async function mockZaiService(endpoint: string, data: any): Promise<AIResponse> {
  switch (endpoint) {
    case 'analyze':
      return {
        success: true,
        data: {
          summary: "Mock Z.AI analysis completed",
          issues: [
            {
              fileName: "main.py",
              line: 8,
              severity: "info",
              message: "Consider using enumerate for cleaner iteration",
              suggestedFix: "Replace range(len()) with enumerate()"
            }
          ]
        }
      };
    case 'fix':
      return {
        success: true,
        data: data.code // Return fixed code
      };
    case 'format':
      return {
        success: true,
        data: data.code // Return formatted code
      };
    default:
      return { success: false, error: "Invalid endpoint" };
  }
}