import { memo, useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, Priority } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import { TagBadge } from './TagBadge';
import { PriorityBadge } from './PriorityBadge';
import { DeadlineIndicator } from './DeadlineIndicator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  searchQuery?: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="search-highlight">{part}</mark>
    ) : (
      part
    )
  );
}

export const TaskCard = memo(function TaskCard({
  task,
  searchQuery = '',
  onEdit,
  onDelete,
}: TaskCardProps) {
  const { toggleTask, tags, setSelectedTag } = useTasks();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      toggleTask(task.id);
      setIsAnimating(false);
    }, 200);
  };

  const taskTags = tags.filter(tag => task.tags.includes(tag.id));

  return (
    <div
      className={cn(
        'task-card group relative flex gap-3 rounded-lg border bg-card p-4 shadow-task',
        task.completed && 'task-completed',
        isAnimating && 'animate-scale-in'
      )}
      role="listitem"
      aria-label={`Задача: ${task.title}`}
    >
      {/* Priority Indicator */}
      <div className={cn('priority-indicator', `priority-${task.priority}`)} />
      
      {/* Checkbox */}
      <div className="flex items-start pt-0.5">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
          className={cn(
            'h-5 w-5 rounded-full transition-all duration-200',
            task.completed && 'animate-check'
          )}
          aria-label={task.completed ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 
            className={cn(
              'task-title font-medium leading-tight',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {highlightText(task.title, searchQuery)}
          </h3>
          
          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground focus:opacity-100 group-hover:opacity-100 focus-ring"
                aria-label="Действия с задачей"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {task.description && (
          <p className={cn(
            'text-sm text-muted-foreground line-clamp-2',
            task.completed && 'line-through'
          )}>
            {highlightText(task.description, searchQuery)}
          </p>
        )}

        {/* Meta row: Tags, Priority, Deadline */}
        <div className="flex flex-wrap items-center gap-2">
          {taskTags.map(tag => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              color={tag.color}
              onClick={() => setSelectedTag(tag.id)}
            />
          ))}
          
          <PriorityBadge priority={task.priority} />
          
          <DeadlineIndicator deadline={task.deadline} completed={task.completed} />
        </div>
      </div>
    </div>
  );
});
