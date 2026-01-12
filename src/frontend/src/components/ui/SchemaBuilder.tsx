import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

export interface SchemaVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
  required?: boolean;
}

interface SchemaBuilderProps {
  label: string;
  description?: string;
  variables: SchemaVariable[];
  onChange: (variables: SchemaVariable[]) => void;
  suggestedNames?: string[];
}

const VARIABLE_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'array', label: 'Array' },
  { value: 'object', label: 'Object' },
] as const;

export function SchemaBuilder({ 
  label, 
  description, 
  variables, 
  onChange, 
  suggestedNames = [] 
}: SchemaBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const addVariable = () => {
    const unusedSuggestion = suggestedNames.find(
      name => !variables.some(v => v.name === name)
    );
    onChange([
      ...variables,
      { 
        name: unusedSuggestion || '', 
        type: 'string', 
        required: true 
      }
    ]);
  };

  const updateVariable = (index: number, updates: Partial<SchemaVariable>) => {
    const newVariables = [...variables];
    newVariables[index] = { ...newVariables[index], ...updates };
    onChange(newVariables);
  };

  const removeVariable = (index: number) => {
    onChange(variables.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-sky-800 hover:text-sky-600 transition-colors"
      >
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        {label}
        {variables.length > 0 && (
          <span className="px-2 py-0.5 text-xs bg-sky-100 text-sky-600 rounded-full">
            {variables.length}
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="pl-6 space-y-3">
          {description && (
            <p className="text-xs text-sky-500">{description}</p>
          )}

          {variables.length === 0 ? (
            <p className="text-sm text-sky-400 italic">No variables defined</p>
          ) : (
            <div className="space-y-2">
              {variables.map((variable, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-sky-50 rounded-xl border border-sky-100"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Variable name"
                      value={variable.name}
                      onChange={(e) => updateVariable(index, { name: e.target.value })}
                      className="text-sm"
                    />
                    <select
                      value={variable.type}
                      onChange={(e) => updateVariable(index, { 
                        type: e.target.value as SchemaVariable['type'] 
                      })}
                      className="px-3 py-2.5 rounded-xl border border-sky-200 bg-white text-sky-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {VARIABLE_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      placeholder="Description (optional)"
                      value={variable.description || ''}
                      onChange={(e) => updateVariable(index, { description: e.target.value })}
                      className="col-span-2 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1.5 text-xs text-sky-600">
                      <input
                        type="checkbox"
                        checked={variable.required ?? true}
                        onChange={(e) => updateVariable(index, { required: e.target.checked })}
                        className="rounded border-sky-300 text-sky-600 focus:ring-sky-500"
                      />
                      Required
                    </label>
                    <button
                      type="button"
                      onClick={() => removeVariable(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={addVariable}
          >
            Add Variable
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper to convert SchemaVariable[] to JSON Schema format
export function variablesToJsonSchema(variables: SchemaVariable[]): Record<string, unknown> {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const variable of variables) {
    properties[variable.name] = {
      type: variable.type,
      ...(variable.description && { description: variable.description }),
    };
    if (variable.required) {
      required.push(variable.name);
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

// Helper to convert JSON Schema back to SchemaVariable[]
export function jsonSchemaToVariables(schema: Record<string, unknown> | null): SchemaVariable[] {
  if (!schema || typeof schema !== 'object') return [];
  
  const properties = schema.properties as Record<string, { type: string; description?: string }> | undefined;
  const required = (schema.required as string[]) || [];

  if (!properties) return [];

  return Object.entries(properties).map(([name, prop]) => ({
    name,
    type: prop.type as SchemaVariable['type'],
    description: prop.description,
    required: required.includes(name),
  }));
}