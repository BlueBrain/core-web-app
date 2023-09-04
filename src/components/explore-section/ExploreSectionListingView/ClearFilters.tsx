import ReloadIcon from '@/components/icons/Reload';
import style from '@/components/explore-section/clearfilters.module.scss';

export default function ClearFilters({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={style.clearFilters} onClick={onClick}>
      <span>Clear filters</span>
      <ReloadIcon className="text-gray-700" />
    </button>
  );
}
