import { useAtom } from 'jotai';
import ReloadIcon from '@/components/icons/Reload';
import { columnKeyToFilter, filtersAtom } from '@/state/explore-section/list-view-atoms';
import style from '@/components/explore-section/clearfilters.module.scss';

export default function ClearFilters() {
  const [filters, setFilters] = useAtom(filtersAtom);
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
