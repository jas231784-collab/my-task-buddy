import { useState, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import { TaskSidebar } from './TaskSidebar';
import { TaskHeader } from './TaskHeader';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';

export function TaskList() {
  const { filteredTasks, filter, searchQuery, selectedTag, deleteTask } = useTasks();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setEditingTask(null);
        setFormOpen(true);
      }
      // Ctrl/Cmd + F: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setFormOpen(false);
        setDeletingTask(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((task: Task) => {
    setDeletingTask(task);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  }, [deletingTask, deleteTask]);

  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  // Determine empty state type
  const getEmptyType = () => {
    if (searchQuery) return 'search';
    if (selectedTag) return 'tag';
    return filter;
  };

  return (
    <div className="flex min-h-screen w-full bg-background theme-transition">
      {/* Sidebar */}
      <TaskSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <TaskHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-3xl">
            {filteredTasks.length === 0 ? (
              <EmptyState type={getEmptyType()} onAddTask={handleAddTask} />
            ) : (
              <div className="space-y-3" role="list" aria-label="Список задач">
                {filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TaskCard
                      task={task}
                      searchQuery={searchQuery}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FAB */}
        <Button
          className="fab-button"
          onClick={handleAddTask}
          aria-label="Добавить задачу"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </main>

      {/* Modals */}
      <TaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
      />

      <DeleteConfirmDialog
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        task={deletingTask}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
