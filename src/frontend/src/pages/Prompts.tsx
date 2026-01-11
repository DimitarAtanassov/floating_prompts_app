import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Play,
  Eye,
  MoreVertical,
  Tag
} from 'lucide-react';
import { Card, Button, Badge, EmptyState } from '../components/ui';

// Mock data - will be replaced with API
const MOCK_PROMPTS = [
  {
    id: '1',
    display_name: 'Article Summarizer - Production',
    template_name: 'summarizer',
    template_version: 2,
    environment: 'production',
    is_active: true,
    category: 'summarization',
    created_at: '2026-01-10T12:00:00Z',
    response_count: 156,
    success_rate: 98.2,
  },
  {
    id: '2',
    display_name: 'Code Review Assistant',
    template_name: 'code-reviewer',
    template_version: 1,
    environment: 'staging',
    is_active: true,
    category: 'development',
    created_at: '2026-01-09T15:30:00Z',
    response_count: 42,
    success_rate: 95.0,
  },
  {
    id: '3',
    display_name: 'Email Composer',
    template_name: 'email-writer',
    template_version: 3,
    environment: 'development',
    is_active: false,
    category: 'generation',
    created_at: '2026-01-08T09:00:00Z',
    response_count: 8,
    success_rate: 100,
  },
];

const environments = ['all', 'production', 'staging', 'development'];

export function Prompts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnv, setSelectedEnv] = useState('all');

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
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}

function PromptCard({ prompt }: { prompt: typeof MOCK_PROMPTS[0] }) {
  const envColors = {
    production: 'bg-emerald-100 text-emerald-700',
    staging: 'bg-amber-100 text-amber-700',
    development: 'bg-sky-100 text-sky-700',
  };

  const formattedDate = new Date(prompt.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

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
            
            <div className="flex items-center gap-4 text-sm text-sky-600 mt-2">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {prompt.template_name} v{prompt.template_version}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formattedDate}
              </span>
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
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
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