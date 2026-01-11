import type { ReactNode } from 'react';
import { Cloud } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-6 animate-float">
        {icon || <Cloud className="w-10 h-10 text-sky-400" />}
      </div>
      <h3 className="text-xl font-semibold text-sky-900 mb-2">{title}</h3>
      <p className="text-sky-600 text-center max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}