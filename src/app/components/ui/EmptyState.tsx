import { LucideIcon } from 'lucide-react';
import { Card } from './card';
import { Button } from './button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="p-8 bg-gray-900/90 border border-gray-800/80 shadow-lg shadow-black/20 text-center">
      <div className="p-3 bg-gray-800/50 rounded-xl inline-flex mb-4 border border-gray-700/50">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60 mb-6 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
