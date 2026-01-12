import axios from 'axios';
import { MOCK_TEMPLATES, type MockTemplate } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === Types ===

export interface Template {
  id: string;
  name: string;
  version: number;
  user_prompt: string;
  system_prompt: string | null;
  description: string | null;
  input_schema: Record<string, unknown> | null;
  output_schema: Record<string, unknown> | null;
  output_format: string | null;
  created_at: string;
  updated_at: string;
}

export interface TemplateCreate {
  name: string;
  user_prompt: string;
  system_prompt?: string;
  description?: string;
  input_schema?: Record<string, unknown>;
  output_schema?: Record<string, unknown>;
  output_format?: string;
}

export interface LLMProvider {
  id: string;
  name: string;
  created_at: string;
}

export interface LLMModel {
  id: string;
  provider_id: string;
  api_model_name: string;
  display_name: string | null;
  is_active: boolean;
  is_deprecated: boolean;
}

export interface LLMConfig {
  id: string;
  model_id: string;
  name: string;
  temperature: number | null;
  extra_settings: Record<string, unknown> | null;
  is_active: boolean;
}

// === API Functions ===

// Use mock data for now, will be replaced with real API calls
const USE_MOCK = true;

export const templatesApi = {
  list: async (): Promise<Template[]> => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_TEMPLATES as Template[];
    }
    return api.get<Template[]>('/templates').then(res => res.data);
  },
  
  get: async (id: string): Promise<Template> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const template = MOCK_TEMPLATES.find(t => t.id === id);
      if (!template) throw new Error('Template not found');
      return template as Template;
    }
    return api.get<Template>(`/templates/${id}`).then(res => res.data);
  },
  
  create: async (data: TemplateCreate): Promise<Template> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // In mock mode, just return a fake created template
      const newTemplate: Template = {
        id: `tpl-${Date.now()}`,
        name: data.name,
        version: 1,
        user_prompt: data.user_prompt,
        system_prompt: data.system_prompt || null,
        description: data.description || null,
        input_schema: data.input_schema || null,
        output_schema: data.output_schema || null,
        output_format: data.output_format || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return newTemplate;
    }
    return api.post<Template>('/templates', data).then(res => res.data);
  },
  
  getByName: async (name: string): Promise<Template[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return MOCK_TEMPLATES.filter(t => t.name === name) as Template[];
    }
    return api.get<Template[]>(`/templates/name/${name}`).then(res => res.data);
  },
  
  getLatest: async (name: string): Promise<Template> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const versions = MOCK_TEMPLATES.filter(t => t.name === name);
      const latest = versions.reduce((a, b) => a.version > b.version ? a : b);
      return latest as Template;
    }
    return api.get<Template>(`/templates/name/${name}/latest`).then(res => res.data);
  },
};

export const modelsApi = {
  listProviders: () => api.get<LLMProvider[]>('/models/providers').then(res => res.data),
  listModels: () => api.get<LLMModel[]>('/models').then(res => res.data),
  listConfigs: () => api.get<LLMConfig[]>('/models/configs').then(res => res.data),
};

export const promptsApi = {
  list: () => api.get('/prompts').then(res => res.data),
  get: (id: string) => api.get(`/prompts/${id}`).then(res => res.data),
};