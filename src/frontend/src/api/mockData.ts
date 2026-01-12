// =============================================================================
// Shared Mock Data - Templates and Prompts
// =============================================================================

export interface MockTemplate {
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

export interface MockPrompt {
  id: string;
  display_name: string;
  template_id: string; // References MockTemplate.id
  template_name: string;
  template_version: number;
  environment: 'production' | 'staging' | 'development';
  is_active: boolean;
  category: string;
  created_at: string;
  response_count: number;
  success_rate: number;
  system_prompt: string | null;
  user_prompt: string;
  input_values: Record<string, string> | null;
  rendered_user_prompt: string;
  llm_model: string;
  llm_provider: string;
}

// =============================================================================
// Mock Templates - These are the "source" templates
// =============================================================================

export const MOCK_TEMPLATES: MockTemplate[] = [
  {
    id: 'tpl-001',
    name: 'summarizer',
    version: 2,
    system_prompt: 'You are a professional content summarizer. Create concise, accurate summaries that capture the key points while maintaining the original tone and intent.',
    user_prompt: 'Please summarize the following {document_type} in {language}. Keep the summary under {max_words} words.\n\nContent to summarize:\n{content}',
    description: 'Summarize documents, articles, and text content into concise overviews.',
    input_schema: {
      type: 'object',
      properties: {
        document_type: { type: 'string', description: 'Type of document (article, paper, report)' },
        language: { type: 'string', description: 'Output language' },
        max_words: { type: 'number', description: 'Maximum words in summary' },
        content: { type: 'string', description: 'Content to summarize' },
      },
      required: ['document_type', 'language', 'max_words', 'content'],
    },
    output_schema: null,
    output_format: 'text',
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-10T12:00:00Z',
  },
  {
    id: 'tpl-001-v1',
    name: 'summarizer',
    version: 1,
    system_prompt: 'You are a content summarizer. Create concise summaries.',
    user_prompt: 'Summarize this text:\n\n{content}',
    description: 'Simple text summarization template.',
    input_schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Content to summarize' },
      },
      required: ['content'],
    },
    output_schema: null,
    output_format: 'text',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
  },
  {
    id: 'tpl-002',
    name: 'code-reviewer',
    version: 1,
    system_prompt: 'You are an experienced senior software engineer conducting code reviews. Focus on code quality, best practices, potential bugs, and security vulnerabilities. Be constructive and educational in your feedback.',
    user_prompt: 'Review the following {language} code and provide feedback:\n\n```{language}\n{code}\n```\n\nFocus areas: {focus_areas}',
    description: 'Conduct thorough code reviews with actionable feedback on quality, security, and best practices.',
    input_schema: {
      type: 'object',
      properties: {
        language: { type: 'string', description: 'Programming language' },
        code: { type: 'string', description: 'Code to review' },
        focus_areas: { type: 'string', description: 'Areas to focus on' },
      },
      required: ['language', 'code', 'focus_areas'],
    },
    output_schema: null,
    output_format: 'markdown',
    created_at: '2026-01-03T14:00:00Z',
    updated_at: '2026-01-09T15:30:00Z',
  },
  {
    id: 'tpl-003',
    name: 'email-writer',
    version: 3,
    system_prompt: 'You are a professional email writer. Write clear, concise, and appropriately toned emails based on the given context and requirements.',
    user_prompt: 'Write a {tone} email to {recipient_type} about {subject}.\n\nKey points to include:\n{key_points}\n\nAdditional context: {context}',
    description: 'Generate professional emails with customizable tone and content.',
    input_schema: {
      type: 'object',
      properties: {
        tone: { type: 'string', description: 'Email tone (professional, casual, formal)' },
        recipient_type: { type: 'string', description: 'Type of recipient (client, colleague, manager)' },
        subject: { type: 'string', description: 'Email subject/topic' },
        key_points: { type: 'string', description: 'Key points to include' },
        context: { type: 'string', description: 'Additional context' },
      },
      required: ['tone', 'recipient_type', 'subject', 'key_points'],
    },
    output_schema: null,
    output_format: 'text',
    created_at: '2026-01-02T09:00:00Z',
    updated_at: '2026-01-08T09:00:00Z',
  },
  {
    id: 'tpl-003-v2',
    name: 'email-writer',
    version: 2,
    system_prompt: 'You are a professional email writer. Write clear and appropriately toned emails.',
    user_prompt: 'Write a {tone} email to {recipient_type} about {subject}.\n\nKey points:\n{key_points}',
    description: 'Generate professional emails with customizable tone.',
    input_schema: {
      type: 'object',
      properties: {
        tone: { type: 'string', description: 'Email tone' },
        recipient_type: { type: 'string', description: 'Type of recipient' },
        subject: { type: 'string', description: 'Email subject' },
        key_points: { type: 'string', description: 'Key points to include' },
      },
      required: ['tone', 'recipient_type', 'subject', 'key_points'],
    },
    output_schema: null,
    output_format: 'text',
    created_at: '2026-01-02T09:00:00Z',
    updated_at: '2026-01-05T09:00:00Z',
  },
  {
    id: 'tpl-003-v1',
    name: 'email-writer',
    version: 1,
    system_prompt: 'Write professional emails.',
    user_prompt: 'Write an email about {subject} to {recipient}.',
    description: 'Basic email generation template.',
    input_schema: {
      type: 'object',
      properties: {
        subject: { type: 'string', description: 'Email subject' },
        recipient: { type: 'string', description: 'Email recipient' },
      },
      required: ['subject', 'recipient'],
    },
    output_schema: null,
    output_format: 'text',
    created_at: '2026-01-01T09:00:00Z',
    updated_at: '2026-01-01T09:00:00Z',
  },
  {
    id: 'tpl-004',
    name: 'translator',
    version: 1,
    system_prompt: 'You are a professional translator. Translate text accurately while preserving the original meaning, tone, and style.',
    user_prompt: 'Translate the following text from {source_language} to {target_language}:\n\n{text}',
    description: 'Translate text between languages while preserving meaning and tone.',
    input_schema: {
      type: 'object',
      properties: {
        source_language: { type: 'string', description: 'Source language' },
        target_language: { type: 'string', description: 'Target language' },
        text: { type: 'string', description: 'Text to translate' },
      },
      required: ['source_language', 'target_language', 'text'],
    },
    output_schema: null,
    output_format: 'text',
    created_at: '2026-01-04T14:00:00Z',
    updated_at: '2026-01-07T14:00:00Z',
  },
  {
    id: 'tpl-005',
    name: 'faq-responder',
    version: 1,
    system_prompt: 'You are a helpful customer support assistant for a SaaS company. Answer questions clearly and direct users to appropriate resources when needed.',
    user_prompt: 'Based on our FAQ database, please provide a helpful response to customer inquiries about account management and billing. Always be polite and offer to escalate to human support if the issue is complex.',
    description: 'Respond to common customer support questions using FAQ knowledge base.',
    input_schema: null,
    output_schema: null,
    output_format: 'text',
    created_at: '2026-01-03T10:00:00Z',
    updated_at: '2026-01-06T10:00:00Z',
  },
  {
    id: 'tpl-006',
    name: 'content-moderator',
    version: 2,
    system_prompt: 'You are a content moderation assistant. Analyze content for policy violations including hate speech, harassment, explicit content, and spam. Respond with a structured analysis.',
    user_prompt: 'Analyze the following user-generated content for policy violations. Return a JSON object with violation categories and severity levels.\n\nContent to analyze:\n{content}',
    description: 'Analyze user-generated content for policy violations and return structured results.',
    input_schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Content to moderate' },
      },
      required: ['content'],
    },
    output_schema: {
      type: 'object',
      properties: {
        has_violations: { type: 'boolean' },
        categories: { type: 'array' },
        severity: { type: 'string' },
        recommendation: { type: 'string' },
      },
    },
    output_format: 'json',
    created_at: '2026-01-02T08:00:00Z',
    updated_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'tpl-006-v1',
    name: 'content-moderator',
    version: 1,
    system_prompt: 'You are a content moderation assistant. Flag inappropriate content.',
    user_prompt: 'Check this content for violations:\n\n{content}',
    description: 'Basic content moderation template.',
    input_schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Content to check' },
      },
      required: ['content'],
    },
    output_schema: null,
    output_format: 'text',
    created_at: '2026-01-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z',
  },
  {
    id: 'tpl-007',
    name: 'standup-formatter',
    version: 1,
    system_prompt: null,
    user_prompt: 'Format the following standup notes into a clean, professional daily update for the team Slack channel. Use bullet points and emojis appropriately.',
    description: 'Format daily standup notes into a clean Slack message.',
    input_schema: null,
    output_schema: null,
    output_format: 'markdown',
    created_at: '2026-01-01T09:00:00Z',
    updated_at: '2026-01-04T09:00:00Z',
  },
  {
    id: 'tpl-008',
    name: 'sql-generator',
    version: 1,
    system_prompt: 'You are an expert SQL developer. Generate efficient, well-formatted SQL queries based on natural language descriptions. Always consider performance and security best practices.',
    user_prompt: 'Generate a {dialect} SQL query for the following requirement:\n\n{requirement}\n\nAvailable tables and their schemas:\n{schema}',
    description: 'Generate SQL queries from natural language descriptions.',
    input_schema: {
      type: 'object',
      properties: {
        dialect: { type: 'string', description: 'SQL dialect (PostgreSQL, MySQL, SQLite)' },
        requirement: { type: 'string', description: 'What the query should do' },
        schema: { type: 'string', description: 'Available table schemas' },
      },
      required: ['dialect', 'requirement', 'schema'],
    },
    output_schema: null,
    output_format: 'code',
    created_at: '2026-01-06T11:00:00Z',
    updated_at: '2026-01-11T11:00:00Z',
  },
  {
    id: 'tpl-009',
    name: 'meeting-summarizer',
    version: 1,
    system_prompt: 'You are an executive assistant skilled at summarizing meetings. Extract key decisions, action items, and important discussion points.',
    user_prompt: 'Summarize the following meeting transcript. Include:\n- Key decisions made\n- Action items with owners\n- Important discussion points\n- Follow-up items\n\nTranscript:\n{transcript}',
    description: 'Summarize meeting transcripts with action items and key decisions.',
    input_schema: {
      type: 'object',
      properties: {
        transcript: { type: 'string', description: 'Meeting transcript' },
      },
      required: ['transcript'],
    },
    output_schema: null,
    output_format: 'markdown',
    created_at: '2026-01-07T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
];

// =============================================================================
// Mock Prompts - These reference the templates above
// =============================================================================

export const MOCK_PROMPTS: MockPrompt[] = [
  {
    id: 'prompt-001',
    display_name: 'Article Summarizer - Production',
    template_id: 'tpl-001',
    template_name: 'summarizer',
    template_version: 2,
    environment: 'production',
    is_active: true,
    category: 'summarization',
    created_at: '2026-01-10T12:00:00Z',
    response_count: 156,
    success_rate: 98.2,
    system_prompt: 'You are a professional content summarizer. Create concise, accurate summaries that capture the key points while maintaining the original tone and intent.',
    user_prompt: 'Please summarize the following {document_type} in {language}. Keep the summary under {max_words} words.\n\nContent to summarize:\n{content}',
    input_values: {
      document_type: 'research paper',
      language: 'English',
      max_words: '150',
      content: '[Article content would be inserted here]'
    },
    rendered_user_prompt: 'Please summarize the following research paper in English. Keep the summary under 150 words.\n\nContent to summarize:\n[Article content would be inserted here]',
    llm_model: 'gpt-4-turbo',
    llm_provider: 'OpenAI',
  },
  {
    id: 'prompt-002',
    display_name: 'Code Review Assistant',
    template_id: 'tpl-002',
    template_name: 'code-reviewer',
    template_version: 1,
    environment: 'staging',
    is_active: true,
    category: 'development',
    created_at: '2026-01-09T15:30:00Z',
    response_count: 42,
    success_rate: 95.0,
    system_prompt: 'You are an experienced senior software engineer conducting code reviews. Focus on code quality, best practices, potential bugs, and security vulnerabilities. Be constructive and educational in your feedback.',
    user_prompt: 'Review the following {language} code and provide feedback:\n\n```{language}\n{code}\n```\n\nFocus areas: {focus_areas}',
    input_values: {
      language: 'TypeScript',
      code: 'function fetchData() { ... }',
      focus_areas: 'performance, error handling, type safety'
    },
    rendered_user_prompt: 'Review the following TypeScript code and provide feedback:\n\n```TypeScript\nfunction fetchData() { ... }\n```\n\nFocus areas: performance, error handling, type safety',
    llm_model: 'claude-3-opus',
    llm_provider: 'Anthropic',
  },
  {
    id: 'prompt-003',
    display_name: 'Email Composer',
    template_id: 'tpl-003',
    template_name: 'email-writer',
    template_version: 3,
    environment: 'development',
    is_active: false,
    category: 'generation',
    created_at: '2026-01-08T09:00:00Z',
    response_count: 8,
    success_rate: 100,
    system_prompt: 'You are a professional email writer. Write clear, concise, and appropriately toned emails based on the given context and requirements.',
    user_prompt: 'Write a {tone} email to {recipient_type} about {subject}.\n\nKey points to include:\n{key_points}\n\nAdditional context: {context}',
    input_values: {
      tone: 'professional',
      recipient_type: 'client',
      subject: 'project update',
      key_points: '- Milestone completed\n- Next steps\n- Timeline adjustment',
      context: 'This is a follow-up to last week\'s meeting'
    },
    rendered_user_prompt: 'Write a professional email to client about project update.\n\nKey points to include:\n- Milestone completed\n- Next steps\n- Timeline adjustment\n\nAdditional context: This is a follow-up to last week\'s meeting',
    llm_model: 'gpt-4',
    llm_provider: 'OpenAI',
  },
  {
    id: 'prompt-004',
    display_name: 'Simple Translator',
    template_id: 'tpl-004',
    template_name: 'translator',
    template_version: 1,
    environment: 'production',
    is_active: true,
    category: 'translation',
    created_at: '2026-01-07T14:00:00Z',
    response_count: 320,
    success_rate: 99.1,
    system_prompt: 'You are a professional translator. Translate text accurately while preserving the original meaning, tone, and style.',
    user_prompt: 'Translate the following text from {source_language} to {target_language}:\n\n{text}',
    input_values: {
      source_language: 'English',
      target_language: 'Spanish',
      text: 'Hello, how are you today?'
    },
    rendered_user_prompt: 'Translate the following text from English to Spanish:\n\nHello, how are you today?',
    llm_model: 'gpt-3.5-turbo',
    llm_provider: 'OpenAI',
  },
  {
    id: 'prompt-005',
    display_name: 'Fixed FAQ Response',
    template_id: 'tpl-005',
    template_name: 'faq-responder',
    template_version: 1,
    environment: 'production',
    is_active: true,
    category: 'support',
    created_at: '2026-01-06T10:00:00Z',
    response_count: 89,
    success_rate: 97.5,
    system_prompt: 'You are a helpful customer support assistant for a SaaS company. Answer questions clearly and direct users to appropriate resources when needed.',
    user_prompt: 'Based on our FAQ database, please provide a helpful response to customer inquiries about account management and billing. Always be polite and offer to escalate to human support if the issue is complex.',
    input_values: null,
    rendered_user_prompt: 'Based on our FAQ database, please provide a helpful response to customer inquiries about account management and billing. Always be polite and offer to escalate to human support if the issue is complex.',
    llm_model: 'gpt-3.5-turbo',
    llm_provider: 'OpenAI',
  },
  {
    id: 'prompt-006',
    display_name: 'Content Moderation',
    template_id: 'tpl-006',
    template_name: 'content-moderator',
    template_version: 2,
    environment: 'production',
    is_active: true,
    category: 'moderation',
    created_at: '2026-01-05T08:00:00Z',
    response_count: 1024,
    success_rate: 99.8,
    system_prompt: 'You are a content moderation assistant. Analyze content for policy violations including hate speech, harassment, explicit content, and spam. Respond with a structured analysis.',
    user_prompt: 'Analyze the following user-generated content for policy violations. Return a JSON object with violation categories and severity levels.\n\nContent to analyze:\n{content}',
    input_values: {
      content: '[User content to be moderated]'
    },
    rendered_user_prompt: 'Analyze the following user-generated content for policy violations. Return a JSON object with violation categories and severity levels.\n\nContent to analyze:\n[User content to be moderated]',
    llm_model: 'claude-3-sonnet',
    llm_provider: 'Anthropic',
  },
  {
    id: 'prompt-007',
    display_name: 'Daily Standup Bot',
    template_id: 'tpl-007',
    template_name: 'standup-formatter',
    template_version: 1,
    environment: 'staging',
    is_active: true,
    category: 'productivity',
    created_at: '2026-01-04T09:00:00Z',
    response_count: 15,
    success_rate: 100,
    system_prompt: null,
    user_prompt: 'Format the following standup notes into a clean, professional daily update for the team Slack channel. Use bullet points and emojis appropriately.',
    input_values: null,
    rendered_user_prompt: 'Format the following standup notes into a clean, professional daily update for the team Slack channel. Use bullet points and emojis appropriately.',
    llm_model: 'gpt-3.5-turbo',
    llm_provider: 'OpenAI',
  },
  {
    id: 'prompt-008',
    display_name: 'SQL Query Generator - Dev',
    template_id: 'tpl-008',
    template_name: 'sql-generator',
    template_version: 1,
    environment: 'development',
    is_active: true,
    category: 'development',
    created_at: '2026-01-11T11:00:00Z',
    response_count: 5,
    success_rate: 100,
    system_prompt: 'You are an expert SQL developer. Generate efficient, well-formatted SQL queries based on natural language descriptions. Always consider performance and security best practices.',
    user_prompt: 'Generate a {dialect} SQL query for the following requirement:\n\n{requirement}\n\nAvailable tables and their schemas:\n{schema}',
    input_values: {
      dialect: 'PostgreSQL',
      requirement: 'Get all users who signed up in the last 30 days',
      schema: 'users (id, email, created_at, status)'
    },
    rendered_user_prompt: 'Generate a PostgreSQL SQL query for the following requirement:\n\nGet all users who signed up in the last 30 days\n\nAvailable tables and their schemas:\nusers (id, email, created_at, status)',
    llm_model: 'gpt-4-turbo',
    llm_provider: 'OpenAI',
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get the template used by a prompt
 */
export function getTemplateForPrompt(prompt: MockPrompt): MockTemplate | undefined {
  return MOCK_TEMPLATES.find(t => t.id === prompt.template_id);
}

/**
 * Get all prompts using a specific template
 */
export function getPromptsForTemplate(templateId: string): MockPrompt[] {
  return MOCK_PROMPTS.filter(p => p.template_id === templateId);
}

/**
 * Get the latest version of each template
 */
export function getLatestTemplates(): MockTemplate[] {
  const latestByName: Record<string, MockTemplate> = {};
  
  for (const template of MOCK_TEMPLATES) {
    if (!latestByName[template.name] || latestByName[template.name].version < template.version) {
      latestByName[template.name] = template;
    }
  }
  
  return Object.values(latestByName);
}

/**
 * Get all versions of a template by name
 */
export function getTemplateVersions(name: string): MockTemplate[] {
  return MOCK_TEMPLATES
    .filter(t => t.name === name)
    .sort((a, b) => b.version - a.version);
}

/**
 * Get prompt usage stats for a template
 */
export function getTemplateUsageStats(templateId: string) {
  const prompts = getPromptsForTemplate(templateId);
  return {
    promptCount: prompts.length,
    activePrompts: prompts.filter(p => p.is_active).length,
    totalResponses: prompts.reduce((sum, p) => sum + p.response_count, 0),
    environments: [...new Set(prompts.map(p => p.environment))],
  };
}