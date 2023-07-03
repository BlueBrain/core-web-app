/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import { DownOutlined, PlusSquareOutlined } from '@ant-design/icons';

import { FilterItemType } from './types';
import FilterItem from './FilterItem';
import Filter from './filter';
import { SettingsIcon } from '@/components/icons';
import { SynapticAssignementRule } from '@/components/SynapticAssignementRulesTable/types';
import Style from './rules-filters.module.css';

export interface RulesFiltersProps {
  rules: SynapticAssignementRule[];
  onFilterChange(filter: Filter): void;
}

export default function RulesFilters({ rules, onFilterChange }: RulesFiltersProps) {
  const [filterItems, setFilterItems] = useState<FilterItemType[]>([]);
  const [filter, setFilter] = useState<Filter>(new Filter([]));
  useEffect(() => {
    console.log('🚀 [RulesFilters] filter = ', filter); // @FIXME: Remove this line written on 2023-07-03 at 16:34
    onFilterChange(filter);
  }, [filter, onFilterChange]);
  const filteredRulesCount = useFilteredRulesCount(rules, filter);
  useFilterUpdate(filterItems, setFilter);
  const handleAdd = useAddHandler(filterItems, setFilterItems);
  return (
    <div className={`${Style.rulesFilters} text-primary-8 text-sm`}>
      <div className="flex">
        <SettingsIcon className="rotate-90 inline-block " style={{ width: 12, height: 12 }} />
        <div className="-mt-1 ml-1 text-sm">Filter</div>
      </div>
      <div>
        <div className="text-sm inline-block">Total: {filteredRulesCount} rules</div>
        <DownOutlined className="text-xs ml-2" />
      </div>
      <div className={Style.filterItems}>
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
    </div>
  );
}

/**
 * Count the number of rules that remain after filtering.
 */
function useFilteredRulesCount(rules: SynapticAssignementRule[], filter: Filter): number {
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
