import { Dispatch, ReactElement, SetStateAction } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import CheckList, { defaultList } from './CheckList';
import listWithInference from './CheckListWithInference';
import DateRange from './DateRange';
import { Filter } from './types';
import { ChevronIcon } from '@/components/icons';
import { classNames } from '@/util/utils';
import styles from './filters.module.scss';

export type FilterGroupProps = {
  items: {
    content?: ({
      filters,
      setFilters,
    }: {
      filters: Filter[];
      setFilters: Dispatch<SetStateAction<Filter[]>>;
    }) => null | ReactElement;
    display?: boolean;
    label: string;
    toggleFunc?: () => void;
  }[];
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

function FilterGroup({ items, filters, setFilters }: FilterGroupProps) {
  return (
    <Accordion.Root
      className="divide-y divide-primary-7 flex flex-col space-y-5"
      defaultValue={['contributor', 'eType']}
      type="multiple"
    >
      {items.map(({ content, display, label, toggleFunc }) => {
        const displayTrigger = display ? (
          <EyeOutlined onClick={toggleFunc} style={{ color: 'white' }} />
        ) : (
          <EyeInvisibleOutlined onClick={toggleFunc} style={{ color: '#69C0FF' }} />
        );

        return content ? (
          <Accordion.Item className="pt-5" value={label} key={label}>
            <div className="flex gap-3 items-center ">
              {displayTrigger}
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

export { CheckList, DateRange, FilterGroup, defaultList, listWithInference };
