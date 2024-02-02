import { EyeIcon } from '@/components/icons';

interface ResetViewButtonProps {
  onResetCamera: () => void;
  isDisabled: boolean;
}
export default function ResetViewButton({ onResetCamera, isDisabled }: ResetViewButtonProps) {
  return (
    <button
      type="button"
      onClick={onResetCamera}
      disabled={isDisabled}
      className={`flex flex-row items-center align-middle ${
        isDisabled ? 'text-neutral-5' : 'text-white'
      }`}
    >
      Reset view
      <EyeIcon className="ml-10" />
    </button>
  );
}
