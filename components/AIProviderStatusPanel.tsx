import React, { useState, useEffect } from 'react';
import { Cpu, Wifi, Battery, Zap, Brain, Server } from 'lucide-react';
import { AIProviderType } from '../types';

interface ProviderStatus {
  id: AIProviderType;
  name: string;
  isConnected: boolean;
  responseTime: number;
  usageCount: number;
  lastUsed: Date;
  estimatedCost: number;
}

interface AIProviderStatusPanelProps {
  currentProvider: AIProviderType;
  isVisible: boolean;
}

const AIProviderStatusPanel: React.FC<AIProviderStatusPanelProps> = ({ currentProvider, isVisible }) => {
  const [providers, setProviders] = useState<ProviderStatus[]>([
    {
      id: 'gemini',
      name: 'Gemini',
      isConnected: true,
      responseTime: 1200,
      usageCount: 42,
      lastUsed: new Date(Date.now() - 300000), // 5 minutes ago
      estimatedCost: 0.02
    },
    {
      id: 'openai',
      name: 'OpenAI',
      isConnected: true,
      responseTime: 950,
      usageCount: 38,
      lastUsed: new Date(Date.now() - 180000), // 3 minutes ago
      estimatedCost: 0.03
    },
    {
      id: 'mistral',
      name: 'Mistral',
      isConnected: true,
      responseTime: 1400,
      usageCount: 25,
      lastUsed: new Date(Date.now() - 420000), // 7 minutes ago
      estimatedCost: 0.01
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      isConnected: true,
      responseTime: 1100,
      usageCount: 18,
      lastUsed: new Date(Date.now() - 600000), // 10 minutes ago
      estimatedCost: 0.015
    },
    {
      id: 'qwen',
      name: 'Qwen',
      isConnected: true,
      responseTime: 1600,
      usageCount: 15,
      lastUsed: new Date(Date.now() - 780000), // 13 minutes ago
      estimatedCost: 0.008
    },
    {
      id: 'zai',
      name: 'Z.AI',
      isConnected: false,
      responseTime: 0,
      usageCount: 0,
      lastUsed: new Date(0),
      estimatedCost: 0
    }
  ]);

  if (!isVisible) return null;

  const currentProviderStatus = providers.find(p => p.id === currentProvider);

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-300">AI Provider Status</h3>
        </div>
        <div className="text-xs text-slate-500">
          Active: <span className="text-blue-400 capitalize">{currentProvider}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {providers.map(provider => (
          <div 
            key={provider.id} 
            className={`p-3 rounded border ${
              provider.id === currentProvider 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-slate-800/50 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Server size={14} className={provider.isConnected ? 'text-emerald-400' : 'text-slate-600'} />
                <span className="text-xs font-medium text-slate-300 capitalize">{provider.name}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${provider.isConnected ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Response:</span>
                <span className="text-slate-300">{provider.responseTime > 0 ? `${provider.responseTime}ms` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Usage:</span>
                <span className="text-slate-300">{provider.usageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Est. Cost:</span>
                <span className="text-slate-300">${provider.estimatedCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {currentProviderStatus && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs font-medium text-slate-300">Current Provider Performance</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-800/30 p-2 rounded text-center">
              <div className="text-slate-400">Response</div>
              <div className="text-slate-200 font-medium">{currentProviderStatus.responseTime}ms</div>
            </div>
            <div className="bg-slate-800/30 p-2 rounded text-center">
              <div className="text-slate-400">Usage</div>
              <div className="text-slate-200 font-medium">{currentProviderStatus.usageCount}</div>
            </div>
            <div className="bg-slate-800/30 p-2 rounded text-center">
              <div className="text-slate-400">Cost</div>
              <div className="text-slate-200 font-medium">${currentProviderStatus.estimatedCost.toFixed(2)}</div>
            </div>
            <div className="bg-slate-800/30 p-2 rounded text-center">
              <div className="text-slate-400">Status</div>
              <div className={`font-medium ${currentProviderStatus.isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                {currentProviderStatus.isConnected ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProviderStatusPanel;