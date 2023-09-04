import { ResetIcon } from '@/components/icons';

export default function ResetViewButton() {
  return (
    <button type="button" className="w-full flex flex-row items-center justify-between p-3">
      <div>Reset view</div>
      <ResetIcon className="text-white w-4 h-4" />
    </button>
  );
}
