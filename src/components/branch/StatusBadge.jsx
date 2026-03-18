import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatusBadge({ merged, label }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
        merged
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-secondary text-muted-foreground border border-border'
      )}
    >
      {merged ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </span>
  );
}