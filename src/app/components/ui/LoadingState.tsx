import { Card } from './card';

interface LoadingStateProps {
  count?: number;
  type?: 'card' | 'list' | 'stat';
}

export function LoadingState({ count = 3, type = 'card' }: LoadingStateProps) {
  if (type === 'stat') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="p-4 bg-gray-900/90 border border-gray-800/80 animate-pulse">
            <div className="h-6 w-6 bg-gray-800/80 rounded-lg mx-auto mb-2" />
            <div className="h-6 w-12 bg-gray-800/80 rounded mx-auto mb-1" />
            <div className="h-3 w-16 bg-gray-800/80 rounded mx-auto" />
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="p-4 bg-gray-900/90 border border-gray-800/80 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-800/80 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-800/80 rounded" />
                <div className="h-3 w-24 bg-gray-800/80 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6 bg-gray-900/90 border border-gray-800/80 animate-pulse">
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-gray-800/80 rounded" />
            <div className="h-3 w-1/2 bg-gray-800/80 rounded" />
          </div>
        </Card>
      ))}
    </div>
  );
}
