import { useState } from 'react';
import { Select, Button } from 'antd';
import isNil from 'lodash/isNil';
import {
  GArticle,
  SortableFields,
  SortableFieldsType,
  SortFn,
  SortDirection,
} from '@/types/literature';
import SortIcon from '@/components/icons/SortIcon';
import { classNames, normalizedDate } from '@/util/utils';

interface SorterProps {
  onChange: (sortFn: SortFn | null) => void;
}

export default function ArticleSorter({ onChange }: SorterProps) {
  const [sortField, setSortField] = useState<SortableFieldsType>(DefaultSortField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const onSortDirectionChange = () => {
    const newSortDirection = nextSortDirection(sortDirection);
    setSortDirection(newSortDirection);

    onChange(newSortDirection === null ? null : getSortFunction(sortField, newSortDirection));
  };

  const onSortFieldChange = (newSortField: SortableFieldsType) => {
    setSortField(newSortField);
    if (sortDirection === null) {
      setSortDirection('asc');
    }
    onChange(getSortFunction(newSortField, sortDirection ?? 'asc'));
  };

  return (
    <div className="flex ml-[10px] items-center">
      <span className="mr-1 font-normal text-neutral-3">Sort by</span>
      <Select
        defaultValue={DefaultSortField}
        options={SortFieldsOptions}
        className={classNames(
          'min-w-[130px] rounded-none border border-solid border-neutral-2',
          '[&>.ant-select-selector]:text-primary-8 [&>.ant-select-selector]:font-bold'
        )}
        popupClassName="!text-primary-8"
        popupMatchSelectWidth={false}
        bordered={false}
        suffixIcon={null}
        onChange={(value) => onSortFieldChange(value as SortableFieldsType)}
        aria-label="sort-by-field-selector"
      />

      <Button
        onClick={onSortDirectionChange}
        icon={<SortIcon direction={sortDirection} className="text-primary-9" />}
        className="bg-transparent border-none"
        aria-label="sort-articles"
      />
    </div>
  );
}

const DefaultSortField: SortableFieldsType = 'publicationDate';

const getSortFunction =
  (sortField: SortableFieldsType, sortDirection: Exclude<SortDirection, null>): SortFn =>
  (a: GArticle, b: GArticle) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    // Undefined values should appear last in list.
    if (isNil(valueA)) {
      return 1;
    }
    if (isNil(valueB)) {
      return -1;
    }

    if (sortField === 'publicationDate') {
      return compareDates(sortDirection, valueA as string, valueB as string);
    }
    return compareNumbers(sortDirection, valueA as number, valueB as number);
  };

const SortFieldsOptions: { value: string; label: string }[] = SortableFields.map((field) => {
  switch (field) {
    case 'publicationDate':
      return { value: field, label: 'Publication date' };
    case 'citationsCount':
      return { label: 'Number of citations', value: field };
    case 'impactFactor':
      return { label: 'Matching score', value: field };
    default:
      throw new Error(`Unhandled sortable field: ${field}`);
  }
});

const compareNumbers = (direction: 'asc' | 'desc', a: number, b: number): number => {
  if (direction === 'asc') {
    return a - b;
  }
  return b - a;
};

const compareDates = (direction: 'asc' | 'desc', a: string, b: string): number => {
  const dateA = +normalizedDate(a);
  const dateB = +normalizedDate(b);
  if (direction === 'asc') {
    return dateA - dateB;
  }
  return dateB - dateA;
};

const nextSortDirection = (currentDirection: SortDirection): SortDirection => {
  switch (currentDirection) {
    case null:
      return 'asc';
    case 'asc':
      return 'desc';
    case 'desc':
      return null;
    default:
      return null;
  }
};
