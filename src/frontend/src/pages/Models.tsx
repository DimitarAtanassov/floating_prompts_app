import { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Settings,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Card, Button, Badge, EmptyState } from '../components/ui';

// Mock data
const MOCK_PROVIDERS = [
  {
    id: '1',
    name: 'openai',
    displayName: 'OpenAI',
    logo: '🤖',
    models: [
      { id: '1', name: 'gpt-4-turbo', displayName: 'GPT-4 Turbo', isActive: true, isDeprecated: false },
      { id: '2', name: 'gpt-4', displayName: 'GPT-4', isActive: true, isDeprecated: false },
      { id: '3', name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo', isActive: true, isDeprecated: false },
    ],
    configs: 3,
  },
  {
    id: '2',
    name: 'anthropic',
    displayName: 'Anthropic',
    logo: '🔮',
    models: [
      { id: '4', name: 'claude-3-opus', displayName: 'Claude 3 Opus', isActive: true, isDeprecated: false },
      { id: '5', name: 'claude-3-sonnet', displayName: 'Claude 3 Sonnet', isActive: true, isDeprecated: false },
      { id: '6', name: 'claude-2.1', displayName: 'Claude 2.1', isActive: false, isDeprecated: true },
    ],
    configs: 2,
  },
  {
    id: '3',
    name: 'google',
    displayName: 'Google AI',
    logo: '✨',
    models: [
      { id: '7', name: 'gemini-pro', displayName: 'Gemini Pro', isActive: true, isDeprecated: false },
      { id: '8', name: 'gemini-ultra', displayName: 'Gemini Ultra', isActive: false, isDeprecated: false },
    ],
    configs: 1,
  },
];

export function Models() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProvider, setExpandedProvider] = useState<string | null>('1');

  const filteredProviders = MOCK_PROVIDERS.filter(p =>
    p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.models.some(m => m.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sky-900">LLM Models</h1>
          <p className="text-sky-600 mt-1">
            Configure providers, models, and reusable settings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<Settings className="w-4 h-4" />}>
            Manage Configs
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            Add Provider
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
          <input
            type="text"
            placeholder="Search providers or models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-200 bg-white text-sky-900 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </Card>

      {/* Provider List */}
      <div className="space-y-4">
        {filteredProviders.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            isExpanded={expandedProvider === provider.id}
            onToggle={() => setExpandedProvider(
              expandedProvider === provider.id ? null : provider.id
            )}
          />
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <EmptyState
          icon={<Cpu className="w-12 h-12 text-sky-400" />}
          title="No providers found"
          description="Add a new LLM provider to get started."
          action={
            <Button icon={<Plus className="w-4 h-4" />}>
              Add Provider
            </Button>
          }
        />
      )}
    </div>
  );
}

function ProviderCard({ 
  provider, 
  isExpanded, 
  onToggle 
}: { 
  provider: typeof MOCK_PROVIDERS[0];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const activeModels = provider.models.filter(m => m.isActive && !m.isDeprecated).length;
  const totalModels = provider.models.length;

  return (
    <Card className="overflow-hidden">
      {/* Provider Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-2 hover:bg-sky-50 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-2xl">
            {provider.logo}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sky-900">{provider.displayName}</h3>
            <p className="text-sm text-sky-600">
              {activeModels} of {totalModels} models active · {provider.configs} configs
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-sky-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Models */}
      {isExpanded && (
        <div className="border-t border-sky-100 mt-2 pt-4 space-y-2">
          {provider.models.map((model) => (
            <div 
              key={model.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-sky-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  model.isDeprecated ? 'bg-amber-400' :
                  model.isActive ? 'bg-emerald-400' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="font-medium text-sky-900">{model.displayName}</p>
                  <p className="text-xs text-sky-500 font-mono">{model.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {model.isDeprecated && (
                  <Badge variant="warning" size="sm">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Deprecated
                  </Badge>
                )}
                {model.isActive ? (
                  <Badge variant="success" size="sm">Active</Badge>
                ) : (
                  <Badge variant="default" size="sm">Inactive</Badge>
                )}
                <Button variant="ghost" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          ))}
          
          <div className="pt-2 flex justify-center">
            <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />}>
              Add Model
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}