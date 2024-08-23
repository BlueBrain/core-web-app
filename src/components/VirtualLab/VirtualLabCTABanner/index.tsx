import SquareAddIcon from '@/components/icons/SquareAddIcon';

type Props = {
  title: string;
  subtitle: string;
  onClick?: () => void;
};

export default function VirtualLabCTABanner({ title, subtitle, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full items-center justify-between rounded-lg bg-[#348537] p-8"
    >
      <div className="z-[2] flex flex-col gap-2 text-left">
        <h4 className="text-2xl font-bold">{title}</h4>
        <p>{subtitle}</p>
      </div>
      <SquareAddIcon />
    </button>
  );
}
