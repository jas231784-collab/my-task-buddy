import { memo } from 'react';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  name: string;
  color?: string;
  onClick?: () => void;
  onRemove?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const colorClasses: Record<string, string> = {
  'tag-work': 'bg-tag-work/15 text-tag-work border-tag-work/30',
  'tag-personal': 'bg-tag-personal/15 text-tag-personal border-tag-personal/30',
  'tag-urgent': 'bg-tag-urgent/15 text-tag-urgent border-tag-urgent/30',
  'tag-home': 'bg-tag-home/15 text-tag-home border-tag-home/30',
  'tag-study': 'bg-tag-study/15 text-tag-study border-tag-study/30',
};

export const TagBadge = memo(function TagBadge({
  name,
  color = 'tag-work',
  onClick,
  onRemove,
  selected = false,
  size = 'sm',
  className,
}: TagBadgeProps) {
  const colorClass = colorClasses[color] || 'bg-primary/15 text-primary border-primary/30';
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border transition-all duration-200',
        colorClass,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        onClick && 'cursor-pointer hover:opacity-80',
        selected && 'ring-2 ring-offset-1 ring-primary',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 focus-ring"
          aria-label={`Удалить тег ${name}`}
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
});
