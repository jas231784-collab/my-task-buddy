import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task, Tag, FilterType, SortType, DEFAULT_TAGS, Priority } from '@/types/task';


interface TaskContextType {
  tasks: Task[];
  tags: Tag[];
  filter: FilterType;
  sort: SortType;
  searchQuery: string;
  selectedTag: string | null;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tagId: string | null) => void;
  
  filteredTasks: Task[];
  stats: {
    total: number;
    completed: number;
    active: number;
    overdue: number;
    percentage: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Generate UUID without external dependency
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('task-manager-tasks', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('task-manager-tags', DEFAULT_TAGS);
  const [filter, setFilter] = useLocalStorage<FilterType>('task-manager-filter', 'all');
  const [sort, setSort] = useLocalStorage<SortType>('task-manager-sort', 'createdAt');
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('task-manager-search', '');
  const [selectedTag, setSelectedTag] = useLocalStorage<string | null>('task-manager-selected-tag', null);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [newTask, ...prev]);
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    ));
  }, [setTasks]);

  const addTag = useCallback((tagData: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tagData,
      id: generateId(),
    };
    setTags(prev => [...prev, newTag]);
  }, [setTags]);

  const updateTag = useCallback((id: string, updates: Partial<Tag>) => {
    setTags(prev => prev.map(tag =>
      tag.id === id ? { ...tag, ...updates } : tag
    ));
  }, [setTags]);

  const deleteTag = useCallback((id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
    // Remove tag from all tasks
    setTasks(prev => prev.map(task => ({
      ...task,
      tags: task.tags.filter(tagId => tagId !== id),
    })));
  }, [setTags, setTasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by status
    if (filter === 'active') {
      result = result.filter(task => !task.completed);
    } else if (filter === 'completed') {
      result = result.filter(task => task.completed);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      result = result.filter(task => task.tags.includes(selectedTag));
    }

    // Sort
    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    
    result.sort((a, b) => {
      switch (sort) {
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [tasks, filter, searchQuery, selectedTag, sort]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const now = new Date();
    const overdue = tasks.filter(t => 
      !t.completed && t.deadline && new Date(t.deadline) < now
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, overdue, percentage };
  }, [tasks]);

  const value: TaskContextType = {
    tasks,
    tags,
    filter,
    sort,
    searchQuery,
    selectedTag,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addTag,
    updateTag,
    deleteTag,
    setFilter,
    setSort,
    setSearchQuery,
    setSelectedTag,
    filteredTasks,
    stats,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
