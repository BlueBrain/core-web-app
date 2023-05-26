/**
 * Calculate time elapsed from today to the given day
 *
 * @param stringDate the given date in string format
 */
export default function timeElapsedFromToday(stringDate?: string) {
  if (!stringDate) return null;
  const date = new Date(stringDate);
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' });

  // calculate how many days have elapsed from current day
  // @ts-ignore
  const daysElapsed = Math.round(Math.abs((today - date) / oneDay));
  // if its less than a year, return amount of days
  if (daysElapsed < 365) {
    return rtf.format(-daysElapsed, 'day');
  }
  const yearsElapsed = Math.floor(daysElapsed / 365);
  // if its more than a year, return amount of years
  return rtf.format(-yearsElapsed, 'year');
}
