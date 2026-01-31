import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow, differenceInHours, isPast } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(d)) return 'Сегодня';
  if (isYesterday(d)) return 'Вчера';
  if (isTomorrow(d)) return 'Завтра';
  
  return format(d, 'd MMMM yyyy', { locale: ru });
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ru });
}

export function getDeadlineStatus(deadline: string | null): 'overdue' | 'soon' | 'safe' | null {
  if (!deadline) return null;
  
  const d = new Date(deadline);
  const now = new Date();
  
  if (isPast(d)) return 'overdue';
  if (differenceInHours(d, now) <= 24) return 'soon';
  return 'safe';
}

export function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

export function formatTaskCount(count: number): string {
  return `${count} ${pluralize(count, 'задача', 'задачи', 'задач')}`;
}
