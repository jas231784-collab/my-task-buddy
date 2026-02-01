import { memo, useState } from 'react';
import { Search, X, Menu, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/contexts/TaskContext';
import { useTheme } from '@/hooks/useTheme';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortType, SORT_LABELS } from '@/types/task';
import { useEffect } from 'react';

interface TaskHeaderProps {
  onMenuClick: () => void;
}

export const TaskHeader = memo(function TaskHeader({ onMenuClick }: TaskHeaderProps) {
  const { searchQuery, setSearchQuery, sort, setSort } = useTasks();
  const { theme, toggleTheme } = useTheme();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3 p-4">
        {/* Hamburger menu (mobile) — 44px tap target */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden flex-shrink-0 min-h-[44px] min-w-[44px] h-11 w-11 md:h-10 md:w-10"
          onClick={onMenuClick}
          aria-label="Открыть меню"
        >
          <Menu className="h-6 w-6 md:h-5 md:w-5" />
        </Button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск задач..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Очистить поиск"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
          <SelectTrigger className="w-[180px] hidden sm:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Theme toggle — 44px tap target on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          className="flex-shrink-0 min-h-[44px] min-w-[44px] h-11 w-11 md:h-10 md:w-10"
        >
          {theme === 'light' ? (
            <Moon className="h-6 w-6 md:h-5 md:w-5" />
          ) : (
            <Sun className="h-6 w-6 md:h-5 md:w-5" />
          )}
        </Button>
      </div>
    </header>
  );
});
