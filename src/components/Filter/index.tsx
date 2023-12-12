import { ReactElement } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import CheckList, { defaultList } from './CheckList';
import DateRange from './DateRange';
import { Filter } from './types';
import { ChevronIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import styles from './filters.module.scss';

type ContentProps = {
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
};

export type FilterGroupProps = {
  items: {
    content?: (contentProps: ContentProps) => null | ReactElement;
    display?: boolean;
    label: string;
    toggleFunc?: () => void;
  }[];
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
};

function FilterGroup({ items, filters, setFilters }: FilterGroupProps) {
  return (
    <Accordion.Root
      className="divide-y divide-primary-7 flex flex-col space-y-5"
      defaultValue={['contributor', 'eType']}
      type="multiple"
    >
      {items?.map(({ content, display, label, toggleFunc }) => {
        const displayTrigger = display ? (
          <button type="button" aria-label="filter-panel-hide-field-button" onClick={toggleFunc}>
            <EyeOutlined style={{ color: 'white' }} />
          </button>
        ) : (
          <button type="button" aria-label="filter-panel-show-field-button" onClick={toggleFunc}>
            <EyeInvisibleOutlined
              style={{ color: '#69C0FF' }}
              aria-label="filter-panel-show-field-button"
            />
          </button>
        );

        return content ? (
          <Accordion.Item className="pt-5" value={label} key={label}>
            <div className="flex gap-3 items-center ">
              {toggleFunc && displayTrigger}
              <Accordion.Trigger
                className={classNames(
                  styles.accordionTrigger,
                  'flex items-center justify-between w-full'
                )}
              >
                <span className="font-bold text-lg text-white">{label}</span>
                <ChevronIcon className={styles.chevron} />
              </Accordion.Trigger>
            </div>
            <Accordion.Content className="py-4">
              {content({ filters, setFilters })}
            </Accordion.Content>
          </Accordion.Item>
        ) : (
          <div className="flex gap-3 items-center pt-5 text-lg text-white" key={label}>
            {displayTrigger}
            <span className="font-bold">{label}</span>
          </div>
        );
      })}
    </Accordion.Root>
  );
}

export { CheckList, DateRange, FilterGroup, defaultList };
