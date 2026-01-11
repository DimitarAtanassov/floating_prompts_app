import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Settings, Loader2, Copy, RotateCcw, Sparkles } from 'lucide-react';
import { templatesApi, modelsApi } from '../api/client';
import { Card, Button, Textarea, Badge, EmptyState } from '../components/ui';

export function Playground() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: templatesApi.list,
  });

  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: modelsApi.listModels,
  });

  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      setSystemPrompt(template.system_prompt || '');
      setUserPrompt(template.user_prompt);
      // Extract and reset placeholders
      const placeholders = extractPlaceholders(template.user_prompt);
      setInputValues(Object.fromEntries(placeholders.map(p => [p, ''])));
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResponse(`This is a simulated response from the LLM.\n\nYour rendered prompt was:\n${renderPrompt(userPrompt, inputValues)}`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setSystemPrompt(selectedTemplate?.system_prompt || '');
    setUserPrompt(selectedTemplate?.user_prompt || '');
    setResponse('');
    setInputValues(Object.fromEntries(
      extractPlaceholders(selectedTemplate?.user_prompt || '').map(p => [p, ''])
    ));
  };

  const placeholders = extractPlaceholders(userPrompt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sky-900">Playground</h1>
          <p className="text-sky-600 mt-1">Test prompts with different models in real-time</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<RotateCcw className="w-4 h-4" />} onClick={handleReset}>
            Reset
          </Button>
          <Button 
            icon={isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            onClick={handleRun}
            disabled={isRunning || !userPrompt}
          >
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-4">
          {/* Template Selection */}
          <Card>
            <h3 className="text-sm font-medium text-sky-700 mb-3">Template</h3>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sky-200 bg-white text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select a template...</option>
              {templates?.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} (v{template.version})
                </option>
              ))}
            </select>
          </Card>

          {/* Model Selection */}
          <Card>
            <h3 className="text-sm font-medium text-sky-700 mb-3">Model</h3>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-sky-200 bg-white text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Select a model...</option>
              {models?.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.display_name || model.api_model_name}
                </option>
              ))}
            </select>
          </Card>

          {/* Placeholder Inputs */}
          {placeholders.length > 0 && (
            <Card>
              <h3 className="text-sm font-medium text-sky-700 mb-3">Variables</h3>
              <div className="space-y-3">
                {placeholders.map((placeholder) => (
                  <div key={placeholder}>
                    <label className="block text-xs text-sky-600 mb-1">{`{${placeholder}}`}</label>
                    <input
                      type="text"
                      value={inputValues[placeholder] || ''}
                      onChange={(e) => setInputValues({ ...inputValues, [placeholder]: e.target.value })}
                      placeholder={`Enter ${placeholder}...`}
                      className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Settings */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-sky-700">Settings</h3>
              <Settings className="w-4 h-4 text-sky-400" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-sky-600 mb-1">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-sky-600 mb-1">Max Tokens</label>
                <input
                  type="number"
                  defaultValue="1024"
                  className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Middle Panel - Prompts */}
        <div className="space-y-4">
          <Card className="h-full">
            <h3 className="text-sm font-medium text-sky-700 mb-3">System Prompt</h3>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Set the AI's behavior..."
              rows={4}
              className="mb-4"
            />
            
            <h3 className="text-sm font-medium text-sky-700 mb-3">User Prompt</h3>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              rows={8}
            />

            {/* Preview */}
            {placeholders.length > 0 && Object.values(inputValues).some(v => v) && (
              <div className="mt-4 pt-4 border-t border-sky-100">
                <h4 className="text-xs font-medium text-sky-600 mb-2">Preview</h4>
                <pre className="bg-sky-50 rounded-lg p-3 text-sm text-sky-800 whitespace-pre-wrap">
                  {renderPrompt(userPrompt, inputValues)}
                </pre>
              </div>
            )}
          </Card>
        </div>

        {/* Right Panel - Response */}
        <div>
          <Card className="h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-sky-700">Response</h3>
              {response && (
                <Button variant="ghost" size="sm" icon={<Copy className="w-4 h-4" />}>
                  Copy
                </Button>
              )}
            </div>
            
            {isRunning ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mb-4 animate-pulse">
                  <Sparkles className="w-6 h-6 text-sky-500" />
                </div>
                <p className="text-sky-600">Generating response...</p>
              </div>
            ) : response ? (
              <pre className="bg-sky-50 rounded-xl p-4 text-sm text-sky-900 whitespace-pre-wrap min-h-[300px]">
                {response}
              </pre>
            ) : (
              <EmptyState
                icon={<Sparkles className="w-10 h-10 text-sky-400" />}
                title="No response yet"
                description="Configure your prompt and click Run to see the LLM response."
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function extractPlaceholders(text: string): string[] {
  const regex = /\{(\w+)\}/g;
  const matches = text.matchAll(regex);
  return [...new Set([...matches].map(m => m[1]))];
}

function renderPrompt(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value || `{${key}}`);
  }
  return result;
}