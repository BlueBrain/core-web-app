import { format } from 'date-fns';
import capitalize from 'lodash/capitalize';

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

export function getCurrentDate(separator: string = '_', returnAlsoTime = false) {
  const now = new Date();
  const timeDisplay = returnAlsoTime ? 'numeric' : undefined;
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: timeDisplay,
    minute: timeDisplay,
    second: timeDisplay,
  } as const;
  let formatted = new Intl.DateTimeFormat('en-GB', options).format(now);
  formatted = formatted.replaceAll('/', separator);
  return formatted;
}

export const normalizedDate = (date: string | number | Date) =>
  date instanceof Date ? date : new Date(date);

export const formatDate = (date: string | Date, formatStr: string = 'dd-MM-yyyy') =>
  format(new Date(date), formatStr);

export const normalizeString = (term: string) => term.trim().toLowerCase();

const conjunctionWords = ['and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'of'];
const romanNumeralsRegex = /^\(?(?=[MDCLXVI])M*(C[MD]|D?C*)(X[CL]|L?X*)(I[XV]|V?I*)\)?$/;

const checkRomanSeperatedByDash = (str: string) => {
  const words = str.split('-');
  return words.every((word) => romanNumeralsRegex.test(word.toUpperCase()));
};

export function brainRegionTitleCaseExceptConjunctions(phrase: string) {
  const words = phrase.split(' ');
  const capitalizedWords = words.map((word) => {
    const lowerWord = word.toLowerCase();
    if (
      conjunctionWords.includes(lowerWord) ||
      romanNumeralsRegex.test(lowerWord.toUpperCase()) ||
      checkRomanSeperatedByDash(word)
    ) {
      return word;
    }
    return capitalize(word);
  });

  return capitalizedWords.join(' ');
}
