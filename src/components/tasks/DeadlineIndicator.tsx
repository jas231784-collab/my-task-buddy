import { memo } from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, getDeadlineStatus } from '@/lib/dateUtils';

interface DeadlineIndicatorProps {
  deadline: string | null;
  completed?: boolean;
  className?: string;
}

export const DeadlineIndicator = memo(function DeadlineIndicator({
  deadline,
  completed = false,
  className,
}: DeadlineIndicatorProps) {
  if (!deadline) return null;

  const status = completed ? null : getDeadlineStatus(deadline);
  
  const statusClasses = {
    overdue: 'deadline-overdue',
    soon: 'deadline-soon',
    safe: 'deadline-safe',
  };

  const Icon = status === 'overdue' ? AlertCircle : status === 'soon' ? Clock : Calendar;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors',
        status ? statusClasses[status] : 'text-muted-foreground bg-muted',
        completed && 'opacity-50',
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {formatDate(deadline)}
    </span>
  );
});
