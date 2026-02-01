-- Add category column to tasks table
-- Allowed values: 'work', 'personal', 'shopping'
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS category text DEFAULT 'personal';

COMMENT ON COLUMN public.tasks.category IS 'Task category: work, personal, or shopping';
