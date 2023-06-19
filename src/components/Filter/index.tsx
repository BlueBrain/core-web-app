import { Dispatch, ReactElement, SetStateAction } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import CheckList from './CheckList';
import DateRange from './DateRange';
import { Filter } from './types';
import { ChevronIcon, EyeIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import styles from './filters.module.scss';

export type FilterGroupProps = {
  items: {
    label: string;
    content: ({
      filters,
      setFilters,
    }: {
      filters: Filter[];
      setFilters: Dispatch<SetStateAction<Filter[]>>;
    }) => ReactElement;
  }[];
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

export function FilterGroup({ items, filters, setFilters }: FilterGroupProps) {
  return (
    <Accordion.Root
      className="divide-y divide-primary-7 flex flex-col space-y-5"
      defaultValue={['contributor', 'eType']}
      type="multiple"
    >
      {items.map(({ label, content }) =>
        content ? (
          <Accordion.Item className="pt-5" value={label} key={label}>
            <Accordion.Trigger
              className={classNames(
                styles.accordionTrigger,
                'flex items-center justify-between w-full'
              )}
            >
              <div className="flex gap-3 items-center justify-between text-lg text-white">
                <EyeIcon fill="white" />
                <span className="font-bold">{label}</span>
              </div>
              <ChevronIcon className={styles.chevron} />
            </Accordion.Trigger>
            <Accordion.Content className="py-4">
              {content({ filters, setFilters })}
            </Accordion.Content>
          </Accordion.Item>
        ) : (
          <div className="flex gap-3 items-center pt-5 text-lg text-white" key={label}>
            <EyeIcon fill="white" />
            <span className="font-bold">{label}</span>
          </div>
        )
      )}
    </Accordion.Root>
  );
}

export { CheckList, DateRange };
