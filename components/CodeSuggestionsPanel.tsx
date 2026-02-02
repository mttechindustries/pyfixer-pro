import React, { useState, useEffect } from 'react';
import { Lightbulb, Wrench, RotateCcw, Code, Zap, GitCommit } from 'lucide-react';
import { PythonFile } from '../types';

interface CodeSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'optimization' | 'readability' | 'security' | 'performance' | 'best-practice';
  file: string;
  line: number;
  confidence: number; // 0-100
  before: string;
  after: string;
}

interface CodeSuggestionsPanelProps {
  files: PythonFile[];
  isVisible: boolean;
  onApplySuggestion: (suggestion: CodeSuggestion) => void;
}

const CodeSuggestionsPanel: React.FC<CodeSuggestionsPanelProps> = ({ 
  files, 
  isVisible, 
  onApplySuggestion 
}) => {
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Generate sample suggestions based on files
  useEffect(() => {
    if (!isVisible || files.length === 0) return;

    setIsLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const sampleSuggestions: CodeSuggestion[] = [];
      
      files.forEach(file => {
        const lines = file.content.split('\n');
        
        // Look for potential improvements in the code
        lines.forEach((line, index) => {
          if (line.includes('for i in range(len(')) {
            sampleSuggestions.push({
              id: `suggestion-${Date.now()}-${sampleSuggestions.length}`,
              title: 'Use enumerate() instead of range(len())',
              description: 'Using enumerate() is more Pythonic and efficient',
              category: 'readability',
              file: file.name,
              line: index + 1,
              confidence: 95,
              before: line.trim(),
              after: line.trim().replace(/for i in range\(len\((\w+)\)\):/, 'for i, value in enumerate($1):')
            });
          }
          
          if (line.includes('import *')) {
            sampleSuggestions.push({
              id: `suggestion-${Date.now()}-${sampleSuggestions.length}`,
              title: 'Avoid wildcard imports',
              description: 'Use specific imports to improve readability and avoid namespace pollution',
              category: 'best-practice',
              file: file.name,
              line: index + 1,
              confidence: 90,
              before: line.trim(),
              after: '# Consider specific imports instead of wildcard'
            });
          }
          
          if (line.includes('eval(') || line.includes('exec(')) {
            sampleSuggestions.push({
              id: `suggestion-${Date.now()}-${sampleSuggestions.length}`,
              title: 'Security risk with eval/exec',
              description: 'Using eval() or exec() can lead to code injection vulnerabilities',
              category: 'security',
              file: file.name,
              line: index + 1,
              confidence: 98,
              before: line.trim(),
              after: '# Replace with safer alternatives'
            });
          }
        });
      });
      
      // Add some general suggestions
      if (files.length > 0) {
        sampleSuggestions.push({
          id: `suggestion-${Date.now()}-${sampleSuggestions.length}`,
          title: 'Add type hints',
          description: 'Improve code maintainability with type annotations',
          category: 'best-practice',
          file: files[0].name,
          line: 1,
          confidence: 85,
          before: 'def calculate_distance(x, y):',
          after: 'def calculate_distance(x: float, y: float) -> float:'
        });
        
        sampleSuggestions.push({
          id: `suggestion-${Date.now()}-${sampleSuggestions.length}`,
          title: 'Add docstrings',
          description: 'Document your functions for better maintainability',
          category: 'readability',
          file: files[0].name,
          line: 1,
          confidence: 80,
          before: 'def calculate_distance(x, y):',
          after: `def calculate_distance(x: float, y: float) -> float:
    \"\"\"Calculate the Euclidean distance between two points.\"\"\"`
        });
      }
      
      setSuggestions(sampleSuggestions);
      setIsLoading(false);
    }, 1000);
  }, [files, isVisible]);

  if (!isVisible) return null;

  const categories = [
    { id: 'all', name: 'All Suggestions', count: suggestions.length },
    { id: 'optimization', name: 'Optimizations', count: suggestions.filter(s => s.category === 'optimization').length },
    { id: 'readability', name: 'Readability', count: suggestions.filter(s => s.category === 'readability').length },
    { id: 'security', name: 'Security', count: suggestions.filter(s => s.category === 'security').length },
    { id: 'performance', name: 'Performance', count: suggestions.filter(s => s.category === 'performance').length },
    { id: 'best-practice', name: 'Best Practices', count: suggestions.filter(s => s.category === 'best-practice').length }
  ];

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'optimization': return 'text-purple-400 bg-purple-500/10';
      case 'readability': return 'text-blue-400 bg-blue-500/10';
      case 'security': return 'text-red-400 bg-red-500/10';
      case 'performance': return 'text-amber-400 bg-amber-500/10';
      case 'best-practice': return 'text-emerald-400 bg-emerald-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'optimization': return <Wrench size={14} />;
      case 'readability': return <Lightbulb size={14} />;
      case 'security': return <Zap size={14} />;
      case 'performance': return <Zap size={14} />;
      case 'best-practice': return <GitCommit size={14} />;
      default: return <Code size={14} />;
    }
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300">Code Suggestions</h3>
        </div>
        <div className="text-xs text-slate-500">
          {suggestions.length} suggestions
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500">Analyzing code for suggestions...</p>
          </div>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Lightbulb size={32} className="mx-auto mb-2 opacity-50" />
          <p>No suggestions found. Your code looks great!</p>
        </div>
      ) : (
        <div className="flex flex-col h-[400px]">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 text-xs rounded-full border transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {category.name} {category.count > 0 && `(${category.count})`}
              </button>
            ))}
          </div>
          
          {/* Suggestions list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredSuggestions.map(suggestion => (
              <div 
                key={suggestion.id} 
                className="p-3 bg-slate-800/50 rounded border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${getCategoryColor(suggestion.category)}`}>
                      {getCategoryIcon(suggestion.category)}
                    </div>
                    <h4 className="font-medium text-slate-200 text-sm">{suggestion.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.confidence > 90 ? 'bg-emerald-500/20 text-emerald-400' :
                      suggestion.confidence > 70 ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {suggestion.confidence}% confidence
                    </span>
                    <span className="text-xs text-slate-500">
                      {suggestion.file}:{suggestion.line}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-400 mb-3">{suggestion.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Before:</div>
                    <div className="text-xs bg-slate-900/50 p-2 rounded font-mono overflow-x-auto max-h-16 overflow-y-auto">
                      {suggestion.before}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">After:</div>
                    <div className="text-xs bg-slate-900/50 p-2 rounded font-mono overflow-x-auto max-h-16 overflow-y-auto">
                      {suggestion.after}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => onApplySuggestion(suggestion)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs rounded transition-colors"
                  >
                    <RotateCcw size={12} />
                    Apply Suggestion
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSuggestionsPanel;