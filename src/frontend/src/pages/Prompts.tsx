import { useState } from 'react';
import { 
  Box, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Play,
  Eye,
  Tag,
  FileText,
  Cpu,
  Copy,
  Check
} from 'lucide-react';
import { Card, Button, Badge, EmptyState, Modal } from '../components/ui';
import { MOCK_PROMPTS, type MockPrompt } from '../api/mockData';

const environments = ['all', 'production', 'staging', 'development'];

export function Prompts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnv, setSelectedEnv] = useState('all');
  const [selectedPrompt, setSelectedPrompt] = useState<MockPrompt | null>(null);

  const filteredPrompts = MOCK_PROMPTS.filter(p => {
    const matchesSearch = p.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.template_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = selectedEnv === 'all' || p.environment === selectedEnv;
    return matchesSearch && matchesEnv;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sky-900">Prompts</h1>
          <p className="text-sky-600 mt-1">
            View and manage rendered prompt instances
          </p>
        </div>
        <Button icon={<Play className="w-4 h-4" />}>
          New Prompt
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-200 bg-white text-sky-900 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex gap-2">
            {environments.map((env) => (
              <button
                key={env}
                onClick={() => setSelectedEnv(env)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all
                  ${selectedEnv === env 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
                  }
                `}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Prompt List */}
      {filteredPrompts.length === 0 ? (
        <EmptyState
          icon={<Box className="w-12 h-12 text-sky-400" />}
          title="No prompts found"
          description="Create a new prompt from a template or adjust your filters."
          action={
            <Button icon={<Play className="w-4 h-4" />}>
              Create Prompt
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredPrompts.map((prompt) => (
            <PromptCard 
              key={prompt.id} 
              prompt={prompt} 
              onView={() => setSelectedPrompt(prompt)}
            />
          ))}
        </div>
      )}

      {/* View Prompt Modal */}
      <PromptViewModal 
        prompt={selectedPrompt}
        isOpen={!!selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  );
}

function PromptCard({ prompt, onView }: { prompt: MockPrompt; onView: () => void }) {
  const envColors = {
    production: 'bg-emerald-100 text-emerald-700',
    staging: 'bg-amber-100 text-amber-700',
    development: 'bg-sky-100 text-sky-700',
  };

  const formattedDate = new Date(prompt.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // Extract placeholders from user_prompt
  const placeholders = prompt.user_prompt.match(/\{(\w+)\}/g) || [];

  return (
    <Card hover>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${prompt.is_active ? 'bg-sky-100' : 'bg-gray-100'}
          `}>
            <Box className={`w-6 h-6 ${prompt.is_active ? 'text-sky-600' : 'text-gray-400'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h3 className="font-semibold text-sky-900">
                {prompt.display_name || prompt.template_name}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${envColors[prompt.environment as keyof typeof envColors]}`}>
                {prompt.environment}
              </span>
              {prompt.is_active ? (
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="default" size="sm">
                  <XCircle className="w-3 h-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-sky-600 mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {prompt.template_name} v{prompt.template_version}
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-4 h-4" />
                {prompt.llm_model}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formattedDate}
              </span>
              {placeholders.length > 0 && (
                <span className="text-sky-400">
                  {placeholders.length} variable{placeholders.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6 text-center">
          <div>
            <p className="text-xl font-bold text-sky-900">{prompt.response_count}</p>
            <p className="text-xs text-sky-500">Responses</p>
          </div>
          <div>
            <p className="text-xl font-bold text-emerald-600">{prompt.success_rate}%</p>
            <p className="text-xs text-sky-500">Success</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} onClick={onView}>
            View
          </Button>
          <Button variant="ghost" size="sm" icon={<Play className="w-4 h-4" />}>
            Test
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface PromptViewModalProps {
  prompt: MockPrompt | null;
  isOpen: boolean;
  onClose: () => void;
}

function PromptViewModal({ prompt, isOpen, onClose }: PromptViewModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!prompt) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const placeholders = prompt.user_prompt.match(/\{(\w+)\}/g) || [];
  const hasVariables = placeholders.length > 0;

  const envColors = {
    production: 'bg-emerald-100 text-emerald-700',
    staging: 'bg-amber-100 text-amber-700',
    development: 'bg-sky-100 text-sky-700',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prompt Details" size="xl">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-sky-900">{prompt.display_name}</h3>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Badge variant="info" size="sm">
                <FileText className="w-3 h-3 mr-1" />
                {prompt.template_name} v{prompt.template_version}
              </Badge>
              <Badge variant="default" size="sm">
                <Cpu className="w-3 h-3 mr-1" />
                {prompt.llm_provider} / {prompt.llm_model}
              </Badge>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${envColors[prompt.environment as keyof typeof envColors]}`}>
                {prompt.environment}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-sky-900">{prompt.success_rate}%</p>
            <p className="text-xs text-sky-500">{prompt.response_count} responses</p>
          </div>
        </div>

        {/* System Prompt */}
        {prompt.system_prompt && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-sky-700">System Prompt</label>
              <button
                onClick={() => copyToClipboard(prompt.system_prompt!, 'system')}
                className="text-sky-400 hover:text-sky-600 p-1 rounded transition-colors"
              >
                {copiedField === 'system' ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <pre className="text-sm text-sky-800 bg-sky-50 rounded-xl p-4 whitespace-pre-wrap border border-sky-100">
              {prompt.system_prompt}
            </pre>
          </div>
        )}

        {/* User Prompt Template (if has variables) */}
        {hasVariables && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-sky-700">
                User Prompt Template
                <span className="ml-2 text-xs text-sky-400">
                  ({placeholders.length} variable{placeholders.length > 1 ? 's' : ''})
                </span>
              </label>
              <button
                onClick={() => copyToClipboard(prompt.user_prompt, 'template')}
                className="text-sky-400 hover:text-sky-600 p-1 rounded transition-colors"
              >
                {copiedField === 'template' ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <pre className="text-sm text-sky-800 bg-amber-50 rounded-xl p-4 whitespace-pre-wrap border border-amber-200">
              {prompt.user_prompt.split(/(\{[^}]+\})/).map((part, i) => 
                part.match(/^\{[^}]+\}$/) ? (
                  <span key={i} className="bg-amber-200 text-amber-800 px-1 rounded font-medium">
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </pre>
          </div>
        )}

        {/* Input Values (if has variables) */}
        {hasVariables && prompt.input_values && (
          <div>
            <label className="text-sm font-medium text-sky-700 block mb-2">Input Values</label>
            <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(prompt.input_values).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs font-medium text-sky-500 mb-1">{key}</span>
                    <span className="text-sm text-sky-800 bg-white px-3 py-2 rounded-lg border border-sky-200 truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rendered User Prompt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-sky-700">
              {hasVariables ? 'Rendered User Prompt' : 'User Prompt'}
            </label>
            <button
              onClick={() => copyToClipboard(prompt.rendered_user_prompt, 'rendered')}
              className="text-sky-400 hover:text-sky-600 p-1 rounded transition-colors"
            >
              {copiedField === 'rendered' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <pre className="text-sm text-sky-800 bg-emerald-50 rounded-xl p-4 whitespace-pre-wrap border border-emerald-200">
            {prompt.rendered_user_prompt}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-sky-100">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button icon={<Play className="w-4 h-4" />}>
            Test in Playground
          </Button>
        </div>
      </div>
    </Modal>
  );
}