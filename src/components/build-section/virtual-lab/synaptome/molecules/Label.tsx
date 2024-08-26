import { classNames } from '@/util/utils';

export const label = (text: string, type: 'main' | 'secondary' = 'main') => (
  <span
    className={classNames(
      'text-base font-light uppercase',
      type === 'main' && 'text-primary-8',
      type === 'secondary' && 'text-neutral-3'
    )}
  >
    {text}
  </span>
);
