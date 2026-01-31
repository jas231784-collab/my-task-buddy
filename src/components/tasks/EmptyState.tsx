import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'all' | 'active' | 'completed' | 'search' | 'tag';
  onAddTask: () => void;
}

const messages = {
  all: {
    title: 'Нет задач',
    description: 'Создайте свою первую задачу и начните организовывать свои дела!',
    showButton: true,
  },
  active: {
    title: 'Нет активных задач',
    description: 'Все задачи выполнены! Отличная работа! 🎉',
    showButton: true,
  },
  completed: {
    title: 'Нет выполненных задач',
    description: 'Здесь появятся задачи, которые вы завершите.',
    showButton: false,
  },
  search: {
    title: 'Ничего не найдено',
    description: 'Попробуйте изменить поисковый запрос.',
    showButton: false,
  },
  tag: {
    title: 'Нет задач с этим тегом',
    description: 'Добавьте этот тег к существующим задачам или создайте новую.',
    showButton: true,
  },
};

export function EmptyState({ type, onAddTask }: EmptyStateProps) {
  const { title, description, showButton } = messages[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ClipboardList className="h-10 w-10 text-muted-foreground" />
      </div>
      
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      
      {showButton && (
        <Button onClick={onAddTask} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить задачу
        </Button>
      )}
    </div>
  );
}
