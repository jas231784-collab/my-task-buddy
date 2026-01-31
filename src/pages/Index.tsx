import { TaskProvider } from '@/contexts/TaskContext';
import { TaskList } from '@/components/tasks/TaskList';

const Index = () => {
  return (
    <TaskProvider>
      <TaskList />
    </TaskProvider>
  );
};

export default Index;
