import { Link } from 'react-router-dom';
import { 
  FileText, 
  Box, 
  Cpu, 
  Play, 
  ArrowRight, 
  Sparkles,
  GitBranch,
  Zap,
  Shield,
  TrendingUp,
  Cloud
} from 'lucide-react';
import { Card, Button } from '../components/ui';

const features = [
  {
    icon: FileText,
    title: 'Template Versioning',
    description: 'Track every change to your prompts with git-like versioning. Never lose a working prompt again.',
    color: 'sky',
  },
  {
    icon: Cpu,
    title: 'Multi-Model Support',
    description: 'Test prompts across OpenAI, Anthropic, Google, and more. Compare results side by side.',
    color: 'violet',
  },
  {
    icon: Play,
    title: 'Interactive Playground',
    description: 'Experiment with prompts in real-time. Adjust parameters and see instant results.',
    color: 'emerald',
  },
  {
    icon: Shield,
    title: 'Environment Control',
    description: 'Manage prompts across development, staging, and production with confidence.',
    color: 'amber',
  },
];

const quickActions = [
  {
    path: '/templates',
    icon: FileText,
    label: 'Templates',
    description: 'Manage prompt templates',
    count: 12,
  },
  {
    path: '/prompts',
    icon: Box,
    label: 'Prompts',
    description: 'View rendered prompts',
    count: 48,
  },
  {
    path: '/models',
    icon: Cpu,
    label: 'Models',
    description: 'Configure LLM models',
    count: 8,
  },
  {
    path: '/playground',
    icon: Play,
    label: 'Playground',
    description: 'Test prompts live',
    accent: true,
  },
];

const stats = [
  { label: 'Templates', value: '12', change: '+3 this week' },
  { label: 'Prompts', value: '48', change: '+12 this week' },
  { label: 'Responses', value: '1.2k', change: '+340 this week' },
  { label: 'Avg Latency', value: '1.2s', change: '-0.3s improvement' },
];

export function Home() {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 p-8 md:p-12">
        {/* Decorative clouds */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-40 bg-sky-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="w-6 h-6 text-sky-200 animate-float" />
            <span className="text-sky-200 text-sm font-medium">Welcome to floating prompts</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Prompt management
            <br />
            <span className="text-sky-200">for modern teams</span>
          </h1>
          
          <p className="text-sky-100 text-lg mb-8 max-w-2xl">
            Version, test, and deploy your AI prompts with confidence. 
            Built for engineering teams who need reliability at scale.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/templates">
              <Button size="lg" className="!bg-white !text-sky-600 hover:!bg-sky-50 shadow-lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link to="/playground">
              <Button size="lg" variant="ghost" className="!text-white !border !border-white/30 hover:!bg-white/10">
                <Play className="w-5 h-5 mr-2" />
                Try Playground
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-sky-900">{stat.value}</p>
              <p className="text-sm font-medium text-sky-700 mt-1">{stat.label}</p>
              <p className="text-xs text-sky-500 mt-2 flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-sky-900">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card 
                  hover 
                  className={`h-full ${action.accent ? 'border-2 border-sky-400 bg-sky-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${action.accent ? 'bg-sky-500' : 'bg-sky-100'}
                    `}>
                      <Icon className={`w-6 h-6 ${action.accent ? 'text-white' : 'text-sky-600'}`} />
                    </div>
                    {action.count && (
                      <span className="text-2xl font-bold text-sky-900">{action.count}</span>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-sky-900">{action.label}</h3>
                    <p className="text-sm text-sky-600 mt-1">{action.description}</p>
                  </div>
                  <div className="mt-4 flex items-center text-sky-500 text-sm font-medium">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Built for Developer Workflows</h2>
          <p className="text-sky-600 max-w-2xl mx-auto">
            Everything you need to manage prompts at scale, from version control to production deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sky-900 mb-2">{feature.title}</h3>
                  <p className="text-sky-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section>
        <Card className="bg-gradient-to-r from-sky-50 to-sky-100 border-sky-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center animate-float">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sky-900 text-lg">Ready to streamline your prompts?</h3>
                <p className="text-sky-600">Start by creating your first template or import existing ones.</p>
              </div>
            </div>
            <Link to="/templates">
              <Button icon={<ArrowRight className="w-4 h-4" />}>
                Create Template
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}