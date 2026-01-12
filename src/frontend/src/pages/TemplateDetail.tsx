import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  GitBranch, 
  Edit, 
  Play, 
  Copy,
  Check,
  GitCommit,
  ChevronRight,
  Eye,
  RotateCcw,
  Tag,
  X
} from 'lucide-react';
import { templatesApi } from '../api/client';
import { getTemplateVersions, getPromptsForTemplate, type MockTemplate } from '../api/mockData';
import { Card, Button, Badge, Modal } from '../components/ui';

export function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<MockTemplate | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const { data: template, isLoading } = useQuery({
    queryKey: ['template', id],
    queryFn: () => templatesApi.get(id!),
    enabled: !!id,
  });

  // Get all versions of this template
  const allVersions = template ? getTemplateVersions(template.name) : [];
  const hasMultipleVersions = allVersions.length > 1;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
              {hasMultipleVersions && (
                <Badge variant="default" size="md">
                  {allVersions.length} versions
                </Badge>
              )}
              <span className="text-sky-500 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            icon={<GitBranch className="w-4 h-4" />}
            onClick={() => setShowVersionHistory(true)}
            disabled={!hasMultipleVersions}
          >
            {hasMultipleVersions ? `View History (${allVersions.length})` : 'No History'}
          </Button>
          <Button variant="secondary" icon={<Edit className="w-4 h-4" />}>
            New Version
          </Button>
          <Button icon={<Play className="w-4 h-4" />}>
            Try in Playground
          </Button>
        </div>
      </div>

      {/* Version Timeline Quick View (if multiple versions) */}
      {hasMultipleVersions && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-sky-700 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Version Timeline
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowVersionHistory(true)}
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {allVersions.map((v, index) => (
              <button
                key={v.id}
                onClick={() => {
                  if (v.id !== template.id) {
                    setSelectedVersion(v);
                  }
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all
                  ${v.id === template.id 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100 cursor-pointer'
                  }
                `}
              >
                <GitCommit className="w-4 h-4" />
                v{v.version}
                {v.id === template.id && (
                  <span className="text-xs opacity-75">(current)</span>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

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
            <button
              onClick={() => template.system_prompt && copyToClipboard(template.system_prompt, 'system')}
              className="text-sky-400 hover:text-sky-600 p-1 rounded transition-colors"
              disabled={!template.system_prompt}
            >
              {copiedField === 'system' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
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
            <button
              onClick={() => copyToClipboard(template.user_prompt, 'user')}
              className="text-sky-400 hover:text-sky-600 p-1 rounded transition-colors"
            >
              {copiedField === 'user' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <pre className="bg-sky-50 rounded-xl p-4 text-sm text-sky-900 whitespace-pre-wrap overflow-x-auto">
            {template.user_prompt.split(/(\{[^}]+\})/).map((part, i) => 
              part.match(/^\{[^}]+\}$/) ? (
                <span key={i} className="bg-amber-200 text-amber-800 px-1 rounded font-medium">
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
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

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        versions={allVersions}
        currentVersionId={template.id}
        onSelectVersion={(v) => {
          setShowVersionHistory(false);
          setSelectedVersion(v);
        }}
        onLoadVersion={(v) => {
          setShowVersionHistory(false);
          navigate(`/templates/${v.id}`);
        }}
      />

      {/* Version Preview Modal */}
      <VersionPreviewModal
        isOpen={!!selectedVersion}
        onClose={() => setSelectedVersion(null)}
        version={selectedVersion}
        onLoad={(v) => {
          setSelectedVersion(null);
          navigate(`/templates/${v.id}`);
        }}
      />
    </div>
  );
}

// =============================================================================
// Version History Modal - Git-like timeline view
// =============================================================================

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: MockTemplate[];
  currentVersionId: string;
  onSelectVersion: (v: MockTemplate) => void;
  onLoadVersion: (v: MockTemplate) => void;
}

function VersionHistoryModal({ 
  isOpen, 
  onClose, 
  versions, 
  currentVersionId,
  onSelectVersion,
  onLoadVersion 
}: VersionHistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Version History" size="lg">
      <div className="space-y-2">
        <p className="text-sm text-sky-600 mb-4">
          View and manage all versions of this template. Click on a version to preview or load it.
        </p>
        
        {/* Git-like timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-sky-200" />
          
          {versions.map((version, index) => {
            const isLatest = index === 0;
            const isCurrent = version.id === currentVersionId;
            const promptsUsingThis = getPromptsForTemplate(version.id);
            const formattedDate = new Date(version.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const placeholders = version.user_prompt.match(/\{(\w+)\}/g) || [];

            return (
              <div key={version.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Commit dot */}
                <div className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${isCurrent 
                    ? 'bg-sky-500 text-white' 
                    : isLatest 
                      ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500' 
                      : 'bg-white text-sky-600 border-2 border-sky-300'
                  }
                `}>
                  <GitCommit className="w-5 h-5" />
                </div>

                {/* Version info */}
                <div className={`
                  flex-1 p-4 rounded-xl border transition-all
                  ${isCurrent 
                    ? 'bg-sky-50 border-sky-300' 
                    : 'bg-white border-sky-100 hover:border-sky-200 hover:shadow-sm cursor-pointer'
                  }
                `}
                onClick={() => !isCurrent && onSelectVersion(version)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sky-900">v{version.version}</span>
                        {isLatest && (
                          <Badge variant="success" size="sm">Latest</Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="info" size="sm">Viewing</Badge>
                        )}
                        {promptsUsingThis.length > 0 && (
                          <Badge variant="warning" size="sm">
                            {promptsUsingThis.length} prompt{promptsUsingThis.length > 1 ? 's' : ''} using
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-sky-600 mt-1">
                        {version.description || 'No description'}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-sky-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>
                        {placeholders.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            {placeholders.length} variable{placeholders.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {!isCurrent && (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Eye className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectVersion(version);
                          }}
                        >
                          Preview
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          icon={<RotateCcw className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onLoadVersion(version);
                          }}
                        >
                          Load
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Changes summary (compare with previous version) */}
                  {index < versions.length - 1 && (
                    <div className="mt-3 pt-3 border-t border-sky-100">
                      <p className="text-xs text-sky-500">
                        Changes from v{versions[index + 1].version}:
                      </p>
                      <div className="flex gap-2 mt-1">
                        {version.system_prompt !== versions[index + 1].system_prompt && (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                            System prompt updated
                          </span>
                        )}
                        {version.user_prompt !== versions[index + 1].user_prompt && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            User prompt updated
                          </span>
                        )}
                        {placeholders.length !== (versions[index + 1].user_prompt.match(/\{(\w+)\}/g) || []).length && (
                          <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded">
                            Variables changed
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

// =============================================================================
// Version Preview Modal
// =============================================================================

interface VersionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  version: MockTemplate | null;
  onLoad: (v: MockTemplate) => void;
}

function VersionPreviewModal({ isOpen, onClose, version, onLoad }: VersionPreviewModalProps) {
  if (!version) return null;

  const formattedDate = new Date(version.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const placeholders = extractPlaceholders(version.user_prompt);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Preview: ${version.name} v${version.version}`} size="xl">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="info" size="md">v{version.version}</Badge>
            <span className="text-sm text-sky-500">{formattedDate}</span>
          </div>
        </div>

        {/* Description */}
        {version.description && (
          <div>
            <label className="text-sm font-medium text-sky-700 block mb-1">Description</label>
            <p className="text-sky-800">{version.description}</p>
          </div>
        )}

        {/* System Prompt */}
        <div>
          <label className="text-sm font-medium text-sky-700 block mb-2">System Prompt</label>
          {version.system_prompt ? (
            <pre className="text-sm text-sky-800 bg-sky-50 rounded-xl p-4 whitespace-pre-wrap border border-sky-100 max-h-32 overflow-y-auto">
              {version.system_prompt}
            </pre>
          ) : (
            <p className="text-sky-400 italic">No system prompt</p>
          )}
        </div>

        {/* User Prompt */}
        <div>
          <label className="text-sm font-medium text-sky-700 block mb-2">User Prompt</label>
          <pre className="text-sm text-sky-800 bg-sky-50 rounded-xl p-4 whitespace-pre-wrap border border-sky-100 max-h-40 overflow-y-auto">
            {version.user_prompt.split(/(\{[^}]+\})/).map((part, i) => 
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

        {/* Variables */}
        {placeholders.length > 0 && (
          <div>
            <label className="text-sm font-medium text-sky-700 block mb-2">Variables</label>
            <div className="flex flex-wrap gap-2">
              {placeholders.map((p, i) => (
                <Badge key={i} variant="default">{`{${p}}`}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-sky-100">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button icon={<RotateCcw className="w-4 h-4" />} onClick={() => onLoad(version)}>
            Load This Version
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function extractPlaceholders(text: string): string[] {
  const regex = /\{(\w+)\}/g;
  const matches = text.matchAll(regex);
  return [...new Set([...matches].map(m => m[1]))];
}