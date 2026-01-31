import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Priority, PRIORITY_LABELS } from '@/types/task';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export const PriorityBadge = memo(function PriorityBadge({
  priority,
  size = 'sm',
  showLabel = true,
  className,
}: PriorityBadgeProps) {
  const priorityClasses: Record<Priority, string> = {
    low: 'bg-priority-low/15 text-priority-low border-priority-low/30',
    medium: 'bg-priority-medium/15 text-priority-medium border-priority-medium/30',
    high: 'bg-priority-high/15 text-priority-high border-priority-high/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        priorityClasses[priority],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      <span className={cn(
        'rounded-full',
        size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
        priority === 'low' && 'bg-priority-low',
        priority === 'medium' && 'bg-priority-medium',
        priority === 'high' && 'bg-priority-high',
      )} />
      {showLabel && PRIORITY_LABELS[priority]}
    </span>
  );
});
