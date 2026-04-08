import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 rounded-full bg-surface-200 flex items-center justify-center mb-6 text-ink-muted/40">
        <Icon className="w-10 h-10" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold mb-2 tracking-tight">{title}</h3>
      <p className="text-ink-muted text-sm max-w-[280px] leading-relaxed mb-8">
        {description}
      </p>
      {action && (
        <div className="animate-in slide-in-from-top-2 duration-700 delay-150 fill-mode-both">
          {action}
        </div>
      )}
    </div>
  );
}
