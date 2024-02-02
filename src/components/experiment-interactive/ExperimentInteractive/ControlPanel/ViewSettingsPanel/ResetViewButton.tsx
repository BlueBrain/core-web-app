import { ResetIcon } from '@/components/icons';

export default function ResetViewButton() {
  return (
    <button type="button" className="flex w-full flex-row items-center justify-between p-3">
      <div>Reset view</div>
      <ResetIcon className="h-4 w-4 text-white" />
    </button>
  );
}
