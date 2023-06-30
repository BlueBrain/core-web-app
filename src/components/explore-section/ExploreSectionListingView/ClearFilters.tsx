import { SetStateAction, Dispatch } from 'react';
import ReloadIcon from '@/components/icons/Reload';
import { Filter } from '@/components/Filter/types';
import { columnKeyToFilter } from '@/state/explore-section/list-atoms-constructor';
import style from '@/components/explore-section/clearfilters.module.scss';

type ClearFiltersProps = {
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

export default function ClearFilters({ filters, setFilters }: ClearFiltersProps) {
  // The columnKeyToFilter method receives a string (key) and in this case it is the equivalent to a filters[x].field
  const submitValues = () => {
    setFilters(filters.map((fil) => columnKeyToFilter(fil.field)));
  };

  return (
    <button type="button" className={style.clearFilters} onClick={submitValues}>
      <span>Clear filters</span>
      <ReloadIcon className="text-gray-700" />
    </button>
  );
}
