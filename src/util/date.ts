import { formatDistanceToNow, isValid, format } from 'date-fns';
import { DateISOString } from '@/types/nexus';

/**
 * Calculate time elapsed from today to the given day
 *
 * @param stringDate the given date in string format
 */
export default function timeElapsedFromToday(stringDate?: DateISOString) {
  const date = validDate(stringDate);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : '-';
}

export function dateColumnInfoToRender(createdAtStr: DateISOString) {
  const date = validDate(createdAtStr);
  if (!date)
    return {
      tooltip: '-',
      text: '-',
    };

  return {
    tooltip: format(date, 'dd-MM-yyyy HH:mm:ss'),
    text: timeElapsedFromToday(createdAtStr),
  };
}

function validDate(stringDate?: DateISOString) {
  if (!stringDate) return;
  const date = new Date(stringDate);
  if (!isValid(date)) return;
  return date;
}
