import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  GitBranch,
  SortAsc,
  SortDesc,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Play,
  Eye,
  Code2,
  Layers,
  Tag,
  ArrowRight,
  Sparkles,
  Cloud
} from 'lucide-react';
import type { Template, TemplateCreate } from '../api/client';
import { templatesApi } from '../api/client';
import { getTemplateVersions, getPromptsForTemplate } from '../api/mockData';
import { Card, Button, Input, Textarea, Badge, Modal, EmptyState } from '../components/ui';
import { 
  SchemaBuilder, 
  variablesToJsonSchema,
  type SchemaVariable 
} from '../components/ui/SchemaBuilder';

export function Templates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'updated'>('updated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: templatesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: templatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setShowCreateModal(false);
    },
  });

  const filteredTemplates = templates?.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group templates by name to show latest version
  const groupedTemplates = filteredTemplates?.reduce((acc, template) => {
    if (!acc[template.name] || acc[template.name].version < template.version) {
      acc[template.name] = template;
    }
    return acc;
  }, {} as Record<string, Template>);

  const templateList = Object.values(groupedTemplates || {}).sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    if (sortBy === 'name') return a.name.localeCompare(b.name) * modifier;
    return (new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) * modifier;
  });

  const toggleSort = (field: 'name' | 'updated') => {
    if (sortBy === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Stats
  const totalTemplates = templateList.length;
  const totalVersions = templates?.length || 0;
  const templatesWithVariables = templateList.filter(t => 
    t.user_prompt.match(/\{(\w+)\}/g)?.length
  ).length;

  if (isLoading) {
    return <TemplatesLoading />;
  }

  return (
    <div className="space-y-8 py-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-sky-100 border border-sky-200/50 p-8">
        {/* Decorative clouds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-sky-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-24 bg-sky-100/50 rounded-full blur-2xl" />
          <Cloud className="absolute top-4 right-8 w-16 h-16 text-sky-100 animate-float-slow" />
          <Cloud className="absolute bottom-4 right-1/4 w-10 h-10 text-sky-50 animate-float-delayed" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-sky-900">Prompt Templates</h1>
                <p className="text-sky-600">Version-controlled prompt engineering</p>
              </div>
            </div>
            <p className="text-sky-700 leading-relaxed">
              Create, version, and manage your AI prompts with precision. 
              Each template is immutable — changes create new versions, giving you complete history and rollback capability.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="secondary"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {/* Quick start wizard */}}
            >
              Quick Start
            </Button>
            <Button 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowCreateModal(true)}
              className="shadow-lg shadow-sky-500/25"
            >
              New Template
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-sky-200/50">
          <div className="text-center">
            <p className="text-3xl font-bold text-sky-900">{totalTemplates}</p>
            <p className="text-sm text-sky-600">Templates</p>
          </div>
          <div className="text-center border-x border-sky-200/50">
            <p className="text-3xl font-bold text-sky-900">{totalVersions}</p>
            <p className="text-sm text-sky-600">Total Versions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-sky-900">{templatesWithVariables}</p>
            <p className="text-sm text-sky-600">With Variables</p>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400 group-focus-within:text-sky-500 transition-colors" />
          <input
            type="text"
            placeholder="Search templates by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-sky-200 bg-white/80 backdrop-blur-sm text-sky-900 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Sort buttons */}
          <div className="flex bg-white rounded-xl border border-sky-200 p-1 shadow-sm">
            <button
              onClick={() => toggleSort('updated')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'updated' 
                  ? 'bg-sky-100 text-sky-700' 
                  : 'text-sky-500 hover:text-sky-700 hover:bg-sky-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              Updated
              {sortBy === 'updated' && (
                sortDirection === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={() => toggleSort('name')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'name' 
                  ? 'bg-sky-100 text-sky-700' 
                  : 'text-sky-500 hover:text-sky-700 hover:bg-sky-50'
              }`}
            >
              Name
              {sortBy === 'name' && (
                sortDirection === 'desc' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* View toggle */}
          <div className="flex bg-white rounded-xl border border-sky-200 p-1 shadow-sm">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'cards' ? 'bg-sky-100 text-sky-700' : 'text-sky-400 hover:text-sky-600'
              }`}
              title="Card view"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'compact' ? 'bg-sky-100 text-sky-700' : 'text-sky-400 hover:text-sky-600'
              }`}
              title="Compact view"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Template List */}
      {templateList.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-12 h-12 text-sky-400" />}
          title={searchQuery ? "No templates match your search" : "No templates yet"}
          description={
            searchQuery 
              ? "Try adjusting your search terms or clear the filter."
              : "Create your first prompt template to get started with version-controlled prompts."
          }
          action={
            searchQuery ? (
              <Button variant="secondary" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            ) : (
              <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
                Create Your First Template
              </Button>
            )
          }
        />
      ) : viewMode === 'cards' ? (
        <div className="grid gap-5">
          {templateList.map((template, index) => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              index={index}
            />
          ))}
        </div>
      ) : (
        <CompactTemplateList templates={templateList} />
      )}

      {/* Create Modal */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}

// =============================================================================
// Template Card - Rich card view
// =============================================================================

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = new Date(template.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Get version count and usage stats
  const allVersions = getTemplateVersions(template.name);
  const promptsUsing = getPromptsForTemplate(template.id);
  
  // Extract placeholders from user_prompt
  const placeholders = template.user_prompt.match(/\{(\w+)\}/g) || [];
  
  // Color based on index for visual variety
  const accentColors = [
    'from-sky-400 to-blue-500',
    'from-cyan-400 to-sky-500',
    'from-blue-400 to-indigo-500',
    'from-sky-400 to-cyan-500',
  ];
  const accent = accentColors[index % accentColors.length];

  return (
    <div className="group relative">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300" />
      
      <Card className="relative bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300">
        <div className="flex items-start gap-5">
          {/* Icon with gradient */}
          <Link to={`/templates/${template.id}`} className="flex-shrink-0">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
              <FileText className="w-7 h-7 text-white" />
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Link to={`/templates/${template.id}`} className="block">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-sky-900 group-hover:text-sky-700 transition-colors truncate">
                  {template.name}
                </h3>
                <Badge variant="info" size="sm">v{template.version}</Badge>
                {allVersions.length > 1 && (
                  <Badge variant="default" size="sm">
                    <GitBranch className="w-3 h-3 mr-1" />
                    {allVersions.length} versions
                  </Badge>
                )}
                {promptsUsing.length > 0 && (
                  <Badge variant="success" size="sm">
                    {promptsUsing.length} active
                  </Badge>
                )}
              </div>
              
              {template.description && (
                <p className="text-sky-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              )}
            </Link>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sky-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formattedDate}
              </span>
              
              {placeholders.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  {placeholders.length} variable{placeholders.length > 1 ? 's' : ''}
                </span>
              )}

              {template.output_format && (
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  {template.output_format}
                </span>
              )}
            </div>

            {/* Variables preview */}
            {placeholders.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {placeholders.slice(0, 4).map((p, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-0.5 text-xs font-mono bg-amber-50 text-amber-700 rounded-md border border-amber-200"
                  >
                    {p}
                  </span>
                ))}
                {placeholders.length > 4 && (
                  <span className="px-2 py-0.5 text-xs text-sky-500">
                    +{placeholders.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to={`/templates/${template.id}`}>
              <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                View
              </Button>
            </Link>
            <Button variant="ghost" size="sm" icon={<Play className="w-4 h-4" />}>
              Test
            </Button>
            
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-sky-400 hover:text-sky-600 hover:bg-sky-100 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-cloud-lg border border-sky-100 py-2 z-50">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-sky-700 hover:bg-sky-50 flex items-center gap-3 transition-colors">
                      <Edit className="w-4 h-4" />
                      Edit Template
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-sky-700 hover:bg-sky-50 flex items-center gap-3 transition-colors">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-sky-700 hover:bg-sky-50 flex items-center gap-3 transition-colors">
                      <GitBranch className="w-4 h-4" />
                      New Version
                    </button>
                    <hr className="my-2 border-sky-100" />
                    <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Prompt Preview */}
        <div className="mt-5 pt-5 border-t border-sky-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-sky-500 uppercase tracking-wide">Preview</span>
            <Link 
              to={`/templates/${template.id}`}
              className="text-xs text-sky-500 hover:text-sky-700 flex items-center gap-1 transition-colors"
            >
              View full template
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <pre className="text-sm text-sky-700 bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-xl p-4 overflow-x-auto border border-sky-100">
            <code className="line-clamp-2">
              {template.user_prompt.split(/(\{[^}]+\})/).map((part, i) => 
                part.match(/^\{[^}]+\}$/) ? (
                  <span key={i} className="text-amber-600 font-medium">{part}</span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </code>
          </pre>
        </div>
      </Card>
    </div>
  );
}

// =============================================================================
// Compact Template List - Condensed table-like view
// =============================================================================

function CompactTemplateList({ templates }: { templates: Template[] }) {
  return (
    <div className="bg-white rounded-2xl border border-sky-200 overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-sky-50 border-b border-sky-200">
            <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wide">Template</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wide">Version</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wide">Variables</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wide">Updated</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-sky-600 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sky-100">
          {templates.map((template) => {
            const placeholders = template.user_prompt.match(/\{(\w+)\}/g) || [];
            const allVersions = getTemplateVersions(template.name);
            
            return (
              <tr key={template.id} className="hover:bg-sky-50/50 transition-colors">
                <td className="px-5 py-4">
                  <Link to={`/templates/${template.id}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                      <FileText className="w-4 h-4 text-sky-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sky-900 group-hover:text-sky-700">{template.name}</p>
                      {template.description && (
                        <p className="text-xs text-sky-500 truncate max-w-xs">{template.description}</p>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="info" size="sm">v{template.version}</Badge>
                    {allVersions.length > 1 && (
                      <span className="text-xs text-sky-400">({allVersions.length} total)</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {placeholders.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-sky-700">{placeholders.length}</span>
                      <span className="text-xs text-sky-400">variables</span>
                    </div>
                  ) : (
                    <span className="text-xs text-sky-400">None</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-sky-600">
                    {new Date(template.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/templates/${template.id}`}>
                      <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} />
                    </Link>
                    <Button variant="ghost" size="sm" icon={<Play className="w-4 h-4" />} />
                    <Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// Loading State
// =============================================================================

function TemplatesLoading() {
  return (
    <div className="space-y-8 py-4">
      {/* Header skeleton */}
      <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-sky-100 p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-10 w-64 skeleton rounded-xl" />
            <div className="h-5 w-96 skeleton rounded-lg" />
          </div>
          <div className="h-11 w-36 skeleton rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-sky-200/50">
          {[1, 2, 3].map(i => (
            <div key={i} className="text-center space-y-2">
              <div className="h-8 w-16 skeleton rounded-lg mx-auto" />
              <div className="h-4 w-20 skeleton rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Search skeleton */}
      <div className="h-14 skeleton rounded-2xl" />
      
      {/* Cards skeleton */}
      <div className="space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 skeleton rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Create Template Modal
// =============================================================================

const OUTPUT_FORMATS = [
  { value: '', label: 'Any (unspecified)' },
  { value: 'text', label: 'Plain Text' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'code', label: 'Code' },
  { value: 'structured', label: 'Structured' },
];

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TemplateCreate) => void;
  isLoading: boolean;
}

function CreateTemplateModal({ isOpen, onClose, onSubmit, isLoading }: CreateTemplateModalProps) {
  const [name, setName] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [description, setDescription] = useState('');
  
  const [inputVariables, setInputVariables] = useState<SchemaVariable[]>([]);
  const [outputVariables, setOutputVariables] = useState<SchemaVariable[]>([]);
  const [outputFormat, setOutputFormat] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: TemplateCreate = { 
      name, 
      user_prompt: userPrompt, 
      system_prompt: systemPrompt || undefined,
      description: description || undefined,
    };

    if (inputVariables.length > 0) {
      data.input_schema = variablesToJsonSchema(inputVariables);
    }
    if (outputVariables.length > 0) {
      data.output_schema = variablesToJsonSchema(outputVariables);
    }
    if (outputFormat) {
      data.output_format = outputFormat;
    }

    onSubmit(data);
  };

  const detectedPlaceholders = userPrompt.match(/\{(\w+)\}/g) || [];
  const suggestedInputNames = detectedPlaceholders.map(p => p.slice(1, -1));

  const handleClose = () => {
    setName('');
    setUserPrompt('');
    setSystemPrompt('');
    setDescription('');
    setInputVariables([]);
    setOutputVariables([]);
    setOutputFormat('');
    setShowAdvanced(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Template" size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Template identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Template Name"
            placeholder="e.g., summarizer, code-reviewer"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Description"
            placeholder="What does this template do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* System Prompt */}
        <Textarea
          label="System Prompt (optional)"
          placeholder="Set the AI's behavior and context..."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={3}
        />

        {/* User Prompt */}
        <div>
          <Textarea
            label="User Prompt"
            placeholder="Use {placeholders} for variables, e.g., Summarize this: {text}"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={5}
            required
          />
          {detectedPlaceholders.length > 0 && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  {detectedPlaceholders.length} variable{detectedPlaceholders.length > 1 ? 's' : ''} detected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {detectedPlaceholders.map((p, i) => (
                  <span key={i} className="px-2 py-1 text-xs font-mono bg-white text-amber-700 rounded-md border border-amber-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Schema Section */}
        <div className="border-t border-sky-100 pt-5">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors"
          >
            <Code2 className="w-4 h-4" />
            {showAdvanced ? 'Hide' : 'Show'} Schema Configuration
            <span className="text-xs text-sky-400">(optional)</span>
          </button>

          {showAdvanced && (
            <div className="mt-5 space-y-6 p-4 bg-sky-50/50 rounded-xl border border-sky-100">
              <SchemaBuilder
                label="Input Schema"
                description="Define the expected input variables and their types."
                variables={inputVariables}
                onChange={setInputVariables}
                suggestedNames={suggestedInputNames}
              />

              <div>
                <label className="block text-sm font-medium text-sky-800 mb-1.5">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sky-200 bg-white text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {OUTPUT_FORMATS.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </select>
              </div>

              <SchemaBuilder
                label="Output Schema (Response Structure)"
                description="Define the expected structure of the LLM response."
                variables={outputVariables}
                onChange={setOutputVariables}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-5 border-t border-sky-100">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} icon={<Plus className="w-4 h-4" />}>
            Create Template
          </Button>
        </div>
      </form>
    </Modal>
  );
}