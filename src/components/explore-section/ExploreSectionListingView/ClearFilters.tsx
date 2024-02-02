import ReloadIcon from '@/components/icons/Reload';

export default function ClearFilters({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex min-w-fit items-center justify-center gap-2 border-none py-3 pr-8 text-white hover:bg-[#ffffff33]"
      onClick={onClick}
    >
      <div>Clear filters</div>
      <ReloadIcon className="text-white" />
    </button>
  );
}
