import { memo } from 'react';
import { 
  ListTodo, 
  Clock, 
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Tag,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/contexts/TaskContext';
import { FilterType, FILTER_LABELS, TASK_CATEGORIES, TaskCategory } from '@/types/task';
import { StatsPanel } from './StatsPanel';
import { TagBadge } from './TagBadge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface TaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const filterIcons: Record<FilterType, React.ComponentType<{ className?: string }>> = {
  all: ListTodo,
  active: Clock,
  completed: CheckCircle2,
};

export const TaskSidebar = memo(function TaskSidebar({ isOpen, onClose }: TaskSidebarProps) {
  const { 
    filter, 
    setFilter, 
    selectedTag, 
    setSelectedTag, 
    selectedCategory,
    setSelectedCategory,
    tags, 
    tasks,
    stats
  } = useTasks();

  const todayCount = tasks.filter(t => {
    if (t.completed || !t.deadline) return false;
    const deadline = new Date(t.deadline);
    const today = new Date();
    return deadline.toDateString() === today.toDateString();
  }).length;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-72 border-r bg-sidebar sidebar-transition',
          'lg:relative lg:z-0 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-bold text-sidebar-foreground">Менеджер задач</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden min-h-[44px] min-w-[44px] h-11 w-11 touch-manipulation"
              onClick={onClose}
              aria-label="Закрыть меню"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Filters */}
            <div className="space-y-1">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Фильтры
              </h3>
              {(Object.keys(FILTER_LABELS) as FilterType[]).map((key) => {
                const Icon = filterIcons[key];
                const count = key === 'all' 
                  ? stats.total 
                  : key === 'active' 
                    ? stats.active 
                    : stats.completed;
                
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setFilter(key);
                      onClose();
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-3 min-h-[44px] md:py-2.5 text-sm transition-colors touch-manipulation',
                      'hover:bg-sidebar-accent focus-ring',
                      filter === key
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5 md:h-4 md:w-4 shrink-0" />
                    <span className="flex-1 text-left">{FILTER_LABELS[key]}</span>
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs',
                      filter === key ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Filters */}
            <div className="space-y-1">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Быстрые фильтры
              </h3>
              <button
                onClick={() => onClose()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 min-h-[44px] md:py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-ring touch-manipulation"
              >
                <Calendar className="h-5 w-5 md:h-4 md:w-4 shrink-0" />
                <span className="flex-1 text-left">Сегодня</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {todayCount}
                </span>
              </button>
              <button
                onClick={() => onClose()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 min-h-[44px] md:py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-ring touch-manipulation"
              >
                <AlertTriangle className="h-5 w-5 md:h-4 md:w-4 shrink-0 text-destructive" />
                <span className="flex-1 text-left">Просрочено</span>
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                  {stats.overdue}
                </span>
              </button>
            </div>

            <Separator />

            {/* Categories */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Категории
                </h3>
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Сбросить
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {TASK_CATEGORIES.map(cat => (
                  <TagBadge
                    key={cat.id}
                    name={cat.name}
                    color={cat.color}
                    selected={selectedCategory === cat.id}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === cat.id ? null : (cat.id as TaskCategory));
                      onClose();
                    }}
                    size="md"
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Теги
                </h3>
                {selectedTag && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setSelectedTag(null)}
                  >
                    Сбросить
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <TagBadge
                    key={tag.id}
                    name={tag.name}
                    color={tag.color}
                    selected={selectedTag === tag.id}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag.id ? null : tag.id);
                      onClose();
                    }}
                    size="md"
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Stats */}
            <StatsPanel />
          </div>
        </div>
      </aside>
    </>
  );
});
