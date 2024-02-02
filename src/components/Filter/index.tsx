import { ReactElement } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import DateRange from './DateRange';
import SearchFilter from './SearchFilter';
import { Filter } from './types';
import { ChevronIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import CheckList, { defaultList } from '@/components/Filter/CheckList/index';
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
      className="flex flex-col space-y-5 divide-y divide-primary-7"
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
            <div className="flex items-center gap-3 ">
              {toggleFunc && displayTrigger}
              <Accordion.Trigger
                className={classNames(
                  styles.accordionTrigger,
                  'flex w-full items-center justify-between'
                )}
              >
                <span className="text-lg font-bold text-white">{label}</span>
                <ChevronIcon className={styles.chevron} />
              </Accordion.Trigger>
            </div>
            <Accordion.Content className="py-4">
              {content({ filters, setFilters })}
            </Accordion.Content>
          </Accordion.Item>
        ) : (
          <div className="flex items-center gap-3 pt-5 text-lg text-white" key={label}>
            {displayTrigger}
            <span className="font-bold">{label}</span>
          </div>
        );
      })}
    </Accordion.Root>
  );
}

export { CheckList, DateRange, FilterGroup, SearchFilter, defaultList };
