import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FileText, Clock, GitBranch, Edit, Play, Copy } from 'lucide-react';
import { templatesApi } from '../api/client';
import { Card, Button, Badge } from '../components/ui';

export function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: template, isLoading } = useQuery({
    queryKey: ['template', id],
    queryFn: () => templatesApi.get(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-sky-100 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-2xl p-6 animate-pulse">
          <div className="h-6 bg-sky-100 rounded w-1/3 mb-4" />
          <div className="h-4 bg-sky-50 rounded w-2/3 mb-2" />
          <div className="h-4 bg-sky-50 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <p className="text-sky-600">Template not found</p>
        <Link to="/templates" className="text-sky-500 hover:underline mt-2 inline-block">
          Back to templates
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(template.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/templates"
        className="inline-flex items-center text-sky-600 hover:text-sky-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Templates
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center">
            <FileText className="w-7 h-7 text-sky-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sky-900">{template.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="info" size="md">v{template.version}</Badge>
              <span className="text-sky-500 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<GitBranch className="w-4 h-4" />}>
            View History
          </Button>
          <Button variant="secondary" icon={<Edit className="w-4 h-4" />}>
            New Version
          </Button>
          <Button icon={<Play className="w-4 h-4" />}>
            Try in Playground
          </Button>
        </div>
      </div>

      {/* Description */}
      {template.description && (
        <Card>
          <h2 className="text-sm font-medium text-sky-700 mb-2">Description</h2>
          <p className="text-sky-900">{template.description}</p>
        </Card>
      )}

      {/* Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Prompt */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-sky-700">System Prompt</h2>
            <Button variant="ghost" size="sm" icon={<Copy className="w-4 h-4" />}>
              Copy
            </Button>
          </div>
          {template.system_prompt ? (
            <pre className="bg-sky-50 rounded-xl p-4 text-sm text-sky-900 whitespace-pre-wrap overflow-x-auto">
              {template.system_prompt}
            </pre>
          ) : (
            <p className="text-sky-400 italic">No system prompt defined</p>
          )}
        </Card>

        {/* User Prompt */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-sky-700">User Prompt</h2>
            <Button variant="ghost" size="sm" icon={<Copy className="w-4 h-4" />}>
              Copy
            </Button>
          </div>
          <pre className="bg-sky-50 rounded-xl p-4 text-sm text-sky-900 whitespace-pre-wrap overflow-x-auto">
            {template.user_prompt}
          </pre>
        </Card>
      </div>

      {/* Placeholders Detection */}
      <Card>
        <h2 className="text-sm font-medium text-sky-700 mb-4">Detected Placeholders</h2>
        <div className="flex flex-wrap gap-2">
          {extractPlaceholders(template.user_prompt).map((placeholder, index) => (
            <Badge key={index} variant="default" size="md">
              {`{${placeholder}}`}
            </Badge>
          ))}
          {extractPlaceholders(template.user_prompt).length === 0 && (
            <p className="text-sky-400 italic">No placeholders detected</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function extractPlaceholders(text: string): string[] {
  const regex = /\{(\w+)\}/g;
  const matches = text.matchAll(regex);
  return [...new Set([...matches].map(m => m[1]))];
}