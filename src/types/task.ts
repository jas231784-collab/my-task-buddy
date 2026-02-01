export type Priority = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'active' | 'completed';

export type SortType = 'createdAt' | 'priority' | 'deadline';

export type TaskCategory = 'work' | 'personal' | 'shopping';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  tags: string[];
  category: TaskCategory;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TasksState {
  tasks: Task[];
  tags: Tag[];
  filter: FilterType;
  sort: SortType;
  searchQuery: string;
  selectedTag: string | null;
  selectedCategory: TaskCategory | null;
}

export const TASK_CATEGORIES: { id: TaskCategory; name: string; color: string }[] = [
  { id: 'work', name: 'Работа', color: 'category-work' },
  { id: 'personal', name: 'Личное', color: 'category-personal' },
  { id: 'shopping', name: 'Покупки', color: 'category-shopping' },
];

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  work: 'Работа',
  personal: 'Личное',
  shopping: 'Покупки',
};

export const DEFAULT_TAGS: Tag[] = [
  { id: 'work', name: 'Работа', color: 'tag-work' },
  { id: 'personal', name: 'Личное', color: 'tag-personal' },
  { id: 'urgent', name: 'Срочно', color: 'tag-urgent' },
  { id: 'home', name: 'Дом', color: 'tag-home' },
  { id: 'study', name: 'Учёба', color: 'tag-study' },
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

export const FILTER_LABELS: Record<FilterType, string> = {
  all: 'Все задачи',
  active: 'Активные',
  completed: 'Выполненные',
};

export const SORT_LABELS: Record<SortType, string> = {
  createdAt: 'По дате создания',
  priority: 'По приоритету',
  deadline: 'По сроку',
};
