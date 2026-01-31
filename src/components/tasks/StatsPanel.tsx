import { memo } from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/contexts/TaskContext';
import { formatTaskCount } from '@/lib/dateUtils';

export const StatsPanel = memo(function StatsPanel() {
  const { stats, tags, tasks } = useTasks();

  // Calculate most used tags
  const tagCounts = tags.map(tag => ({
    ...tag,
    count: tasks.filter(t => t.tags.includes(tag.id)).length,
  })).filter(t => t.count > 0).sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Статистика
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Circle}
          label="Всего"
          value={stats.total}
          className="text-foreground"
        />
        <StatCard
          icon={CheckCircle2}
          label="Выполнено"
          value={stats.completed}
          className="text-success"
        />
        <StatCard
          icon={Clock}
          label="Активных"
          value={stats.active}
          className="text-primary"
        />
        <StatCard
          icon={AlertTriangle}
          label="Просрочено"
          value={stats.overdue}
          className="text-destructive"
        />
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Прогресс</span>
          <span className="font-medium">{stats.percentage}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-success transition-all duration-500 ease-out"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* Popular Tags */}
      {tagCounts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Популярные теги</h4>
          <div className="space-y-1.5">
            {tagCounts.map(tag => (
              <div key={tag.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{tag.name}</span>
                <span className="text-muted-foreground">{tag.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  className?: string;
}

function StatCard({ icon: Icon, label, value, className }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-2">
        <Icon className={cn('h-4 w-4', className)} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={cn('mt-1 text-xl font-bold', className)}>{value}</p>
    </div>
  );
}
