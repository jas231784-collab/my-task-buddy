import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, Priority, PRIORITY_LABELS, Tag } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TagBadge } from './TagBadge';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskForm({ open, onOpenChange, task }: TaskFormProps) {
  const { addTask, updateTask, tags } = useTasks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<{ title?: string }>({});

  // Reset form when opening/closing or task changes
  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setSelectedTags(task.tags);
        setDeadline(task.deadline ? new Date(task.deadline) : undefined);
      } else {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setSelectedTags([]);
        setDeadline(undefined);
      }
      setErrors({});
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setErrors({ title: 'Название задачи обязательно' });
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      tags: selectedTags,
      deadline: deadline ? deadline.toISOString() : null,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onOpenChange(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Редактировать задачу' : 'Новая задача'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Название *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="Введите название задачи..."
              className={cn(errors.title && 'border-destructive')}
              autoFocus
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Добавьте описание (необязательно)"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Приоритет</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'h-2 w-2 rounded-full',
                        value === 'low' && 'bg-priority-low',
                        value === 'medium' && 'bg-priority-medium',
                        value === 'high' && 'bg-priority-high',
                      )} />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Теги</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <TagBadge
                  key={tag.id}
                  name={tag.name}
                  color={tag.color}
                  selected={selectedTags.includes(tag.id)}
                  onClick={() => toggleTag(tag.id)}
                  size="md"
                />
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Срок выполнения</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'flex-1 justify-start text-left font-normal',
                      !deadline && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline
                      ? format(deadline, 'd MMMM yyyy', { locale: ru })
                      : 'Установить срок выполнения'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    locale={ru}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {deadline && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeadline(undefined)}
                  aria-label="Удалить срок"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отменить
            </Button>
            <Button type="submit">
              {task ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
