import { format } from 'date-fns';

export function createHeaders(
  token: string,
  extraOptions: Record<string, string> | null = {
    'Content-Type': 'application/json',
    Accept: '*/*',
  }
) {
  return new Headers({
    Authorization: `Bearer ${token}`,
    ...extraOptions,
  });
}

export function classNames(...classes: Array<string | null | undefined | boolean>) {
  return classes.filter(Boolean).join(' ');
}

export function getCurrentDate(separator: string = '_') {
  const now = new Date();
  let formatted = new Intl.DateTimeFormat('en-GB').format(now);
  formatted = formatted.replaceAll('/', separator);
  return formatted;
}

export const normalizedDate = (date: string | number | Date) =>
  date instanceof Date ? date : new Date(date);

export const formatDate = (date: string, formatStr: string = 'dd-MM-yyyy') =>
  format(new Date(date), formatStr);
