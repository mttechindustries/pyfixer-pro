import React, { useState } from 'react';
import { X, Save, Settings, Cpu, Key, Globe } from 'lucide-react';
import { AIProviderType } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: AIProviderType;
  onProviderChange: (provider: AIProviderType) => void;
  apiKeys: Record<string, string>;
  onApiKeyChange: (provider: AIProviderType, key: string) => void;
  onSave: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  currentProvider,
  onProviderChange,
  apiKeys,
  onApiKeyChange,
  onSave
}) => {
  if (!isOpen) return null;

  const providers: { id: AIProviderType; name: string; icon: JSX.Element }[] = [
    { id: 'gemini', name: 'Google Gemini', icon: <Cpu size={16} /> },
    { id: 'openai', name: 'OpenAI', icon: <Globe size={16} /> },
    { id: 'mistral', name: 'Mistral AI', icon: <Cpu size={16} /> },
    { id: 'openrouter', name: 'OpenRouter', icon: <Globe size={16} /> },
    { id: 'qwen', name: 'Alibaba Qwen', icon: <Cpu size={16} /> },
    { id: 'zai', name: 'Z.AI', icon: <Cpu size={16} /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="https://github.com/mttechindustries/mttechindustries.github.io/blob/main/mtlogodark.webp?raw=true"
              alt="MT Tech Industries Logo"
              className="w-5 h-5 object-contain"
            />
            <h2 className="text-lg font-bold text-slate-200">PyFixer-Pro Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Provider Selection */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Cpu size={16} className="text-blue-400" />
              AI Provider
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {providers.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => onProviderChange(provider.id)}
                  className={`p-3 rounded border transition-all flex flex-col items-center gap-2 ${
                    currentProvider === provider.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {provider.icon}
                  <span className="text-xs">{provider.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* API Keys Configuration */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Key size={16} className="text-emerald-400" />
              API Keys
            </h3>
            <div className="space-y-3">
              {providers.map(provider => (
                <div key={provider.id} className="space-y-1">
                  <label className="text-xs text-slate-500 capitalize">{provider.name} API Key</label>
                  <input
                    type="password"
                    value={apiKeys[provider.id] || ''}
                    onChange={(e) => onApiKeyChange(provider.id, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={`Enter ${provider.name} API key`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm text-white rounded flex items-center gap-2 transition-colors"
          >
            <Save size={14} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;