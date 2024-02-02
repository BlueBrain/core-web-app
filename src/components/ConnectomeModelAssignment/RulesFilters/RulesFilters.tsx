import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import { DownOutlined, PlusSquareOutlined, RightOutlined } from '@ant-design/icons';
import { FilterItemType } from './types';
import FilterItem from './FilterItem';
import Filter from './filter';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import { SettingsIcon } from '@/components/icons';
import styles from './rules-filters.module.css';

export interface RulesFiltersProps {
  rules: SynapticAssignmentRule[];
  onFilterChange(filter: Filter): void;
}

export default function RulesFilters({ rules, onFilterChange }: RulesFiltersProps) {
  const [showDetails, toggleDetails] = useToggle(false);
  const [filterItems, setFilterItems] = useState<FilterItemType[]>([]);
  const [filter, setFilter] = useState<Filter>(new Filter([]));
  useEffect(() => onFilterChange(filter), [filter, onFilterChange]);
  const filteredRulesCount = useFilteredRulesCount(rules, filter);
  useFilterUpdate(filterItems, setFilter);
  const handleAdd = useAddHandler(filterItems, setFilterItems);
  return (
    <div className={`${styles.rulesFilters} text-sm text-primary-8`}>
      <button onClick={toggleDetails} type="button">
        <SettingsIcon className="inline-block rotate-90 " style={{ width: 12, height: 12 }} />
        <div className="-mt-1 ml-1 text-sm">Filter</div>
      </button>
      <button onClick={toggleDetails} type="button">
        <div className="inline-block text-sm">Total: {filteredRulesCount} rules</div>
        {showDetails ? <DownOutlined /> : <RightOutlined />}
      </button>
      {showDetails && (
        <div className={styles.filterItems}>
          {filterItems.map((item, index) => (
            <>
              <div key={`label-${item.ruleField}`}>
                {index === 0 ? 'Show me pathways with:' : 'and that have:'}
              </div>
              <FilterItem
                key={`value-${item.ruleField}`}
                item={item}
                onChange={(newItem) =>
                  setFilterItems([
                    ...filterItems.slice(0, index),
                    newItem,
                    ...filterItems.slice(index + 1),
                  ])
                }
                onDelete={() =>
                  setFilterItems([...filterItems.slice(0, index), ...filterItems.slice(index + 1)])
                }
              />
            </>
          ))}
          <Button icon={<PlusSquareOutlined />} onClick={handleAdd}>
            Add new filter
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Count the number of rules that remain after filtering.
 */
function useFilteredRulesCount(rules: SynapticAssignmentRule[], filter: Filter): number {
  return useMemo(
    () => rules.reduce((count, rule) => (filter.exec(rule) ? count + 1 : count), 0),
    [rules, filter]
  );
}

function useAddHandler(
  filterItems: FilterItemType[],
  setFilterItems: Dispatch<SetStateAction<FilterItemType[]>>
) {
  return useCallback(() => {
    setFilterItems([
      ...filterItems,
      {
        ruleField: 'fromEType',
        value: '',
      },
    ]);
  }, [filterItems, setFilterItems]);
}

function useFilterUpdate(
  filterItems: FilterItemType[],
  setFilter: Dispatch<SetStateAction<Filter>>
) {
  useEffect(() => {
    setFilter(new Filter(filterItems));
  }, [filterItems, setFilter]);
}

function useToggle(initialValue: boolean): [value: boolean, toggle: () => void] {
  const [value, setValue] = useState(initialValue);
  return [value, () => setValue(!value)];
}
