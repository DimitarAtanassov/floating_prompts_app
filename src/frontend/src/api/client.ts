import axios from 'axios';

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
  created_at: string;
  updated_at: string;
}

export interface TemplateCreate {
  name: string;
  user_prompt: string;
  system_prompt?: string;
  description?: string;
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

export const templatesApi = {
  list: () => api.get<Template[]>('/templates').then(res => res.data),
  get: (id: string) => api.get<Template>(`/templates/${id}`).then(res => res.data),
  create: (data: TemplateCreate) => api.post<Template>('/templates', data).then(res => res.data),
  getByName: (name: string) => api.get<Template[]>(`/templates/name/${name}`).then(res => res.data),
  getLatest: (name: string) => api.get<Template>(`/templates/name/${name}/latest`).then(res => res.data),
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