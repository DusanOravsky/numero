import namedaysData from './namedays.json';

const namedays = namedaysData as Record<string, string[]>;

export function getNameDaysForDate(month: number, day: number): string[] {
  const key = String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  return namedays[key] || [];
}

export function hasNameDayToday(firstName: string): boolean {
  const today = new Date();
  const names = getNameDaysForDate(today.getMonth() + 1, today.getDate());
  const normalized = firstName.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  return names.some(n => n.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '') === normalized);
}

export function getTodayNameDays(): string[] {
  const today = new Date();
  return getNameDaysForDate(today.getMonth() + 1, today.getDate());
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0];
}
