import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  ChevronRight, 
  GitBranch,
  Filter,
  SortAsc,
  MoreVertical,
  Copy,
  Trash2,
  Edit
} from 'lucide-react';
import type { Template, TemplateCreate } from '../api/client';
import { templatesApi } from '../api/client';
import { Card, Button, Input, Textarea, Badge, Modal, EmptyState } from '../components/ui';

export function Templates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'updated'>('updated');
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
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  if (isLoading) {
    return <TemplatesLoading />;
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-sky-900">Prompt Templates</h1>
          <p className="text-sky-600 mt-1">
            Manage and version your prompt templates
          </p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          New Template
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-200 bg-white text-sky-900 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              icon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>
            <Button 
              variant="secondary" 
              icon={<SortAsc className="w-4 h-4" />}
              onClick={() => setSortBy(sortBy === 'name' ? 'updated' : 'name')}
            >
              {sortBy === 'name' ? 'Name' : 'Updated'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Template List */}
      {templateList.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-12 h-12 text-sky-400" />}
          title="No templates yet"
          description="Create your first prompt template to get started with version-controlled prompts."
          action={
            <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
              Create Template
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {templateList.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
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

function TemplateCard({ template }: { template: Template }) {
  const [showMenu, setShowMenu] = useState(false);

  const formattedDate = new Date(template.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Extract placeholders from user_prompt
  const placeholders = template.user_prompt.match(/\{(\w+)\}/g) || [];

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between">
        <Link to={`/templates/${template.id}`} className="flex-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 transition-colors">
              <FileText className="w-6 h-6 text-sky-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-sky-900 truncate">{template.name}</h3>
                <Badge variant="info">v{template.version}</Badge>
              </div>
              {template.description && (
                <p className="text-sky-600 text-sm mb-3 line-clamp-2">{template.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-sky-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  {template.version} version{template.version > 1 ? 's' : ''}
                </span>
                {placeholders.length > 0 && (
                  <span className="flex items-center gap-1">
                    {placeholders.length} variable{placeholders.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-sky-400 hover:text-sky-600 hover:bg-sky-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-cloud-lg border border-sky-100 py-2 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-sky-700 hover:bg-sky-50 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-sky-700 hover:bg-sky-50 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-sky-700 hover:bg-sky-50 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  New Version
                </button>
                <hr className="my-2 border-sky-100" />
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-4 pt-4 border-t border-sky-100">
        <pre className="text-xs text-sky-700 bg-sky-50 rounded-lg p-3 overflow-x-auto line-clamp-2">
          {template.user_prompt}
        </pre>
      </div>
    </Card>
  );
}

function TemplatesLoading() {
  return (
    <div className="space-y-6 py-2">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 skeleton rounded-lg" />
          <div className="h-4 w-64 skeleton rounded-lg" />
        </div>
        <div className="h-10 w-36 skeleton rounded-xl" />
      </div>
      <div className="h-16 skeleton rounded-2xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 skeleton rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      name, 
      user_prompt: userPrompt, 
      system_prompt: systemPrompt || undefined,
      description: description || undefined 
    });
  };

  const detectedPlaceholders = userPrompt.match(/\{(\w+)\}/g) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Template" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Template Name"
          placeholder="e.g., summarizer, translator, code-reviewer"
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

        <Textarea
          label="System Prompt (optional)"
          placeholder="Set the AI's behavior and context..."
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={3}
        />

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
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs text-sky-500">Detected variables:</span>
              {detectedPlaceholders.map((p, i) => (
                <Badge key={i} variant="default" size="sm">{p}</Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-sky-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Create Template
          </Button>
        </div>
      </form>
    </Modal>
  );
}