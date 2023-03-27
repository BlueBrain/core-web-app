import { Dispatch, ReactElement, SetStateAction } from 'react';
import { useAtom } from 'jotai/react';
import * as Accordion from '@radix-ui/react-accordion';
import { PrimitiveAtom } from 'jotai';
import CheckList from './CheckList';
import { Filter } from './types';
import { ChevronIcon, EyeIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import styles from './filters.module.scss';

type FilterGroupProps = {
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
  filtersAtom: PrimitiveAtom<Filter[]>;
};

export function FilterGroup({ items, filtersAtom }: FilterGroupProps) {
  const [filters, setFilters] = useAtom(filtersAtom);

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
                <span className="font-bold">
                  {label.replace(/^_*(.)|_+(.)/g, (_s, c, d) =>
                    c ? c.toUpperCase() : ` ${d.toUpperCase()}`
                  )}
                </span>
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
            <span className="font-bold">
              {label.replace(/^_*(.)|_+(.)/g, (_s, c, d) =>
                c ? c.toUpperCase() : ` ${d.toUpperCase()}`
              )}
            </span>
          </div>
        )
      )}
    </Accordion.Root>
  );
}

export { CheckList };
