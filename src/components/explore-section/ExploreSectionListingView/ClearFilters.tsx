import ReloadIcon from '@/components/icons/Reload';

export default function ClearFilters({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="text-white flex gap-2 items-center justify-center min-w-fit border-none py-3 pl-2 pr-8 hover:bg-[#ffffff33]"
      onClick={onClick}
    >
      <div>Clear filters</div>
      <ReloadIcon className="text-white" />
    </button>
  );
}
