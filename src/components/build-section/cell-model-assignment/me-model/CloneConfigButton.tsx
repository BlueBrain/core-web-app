import { classNames } from '@/util/utils';
import GenericButton from '@/components/Global/GenericButton';

const positionStyle = 'absolute bottom-5 right-5 flex items-center gap-3';

type Props = {
  className?: string;
};

export default function CloneConfigButton({ className }: Props) {
  return (
    <div className={classNames(className, positionStyle)}>
      <GenericButton
        text="Clone config"
        className="border-green-600 text-white bg-green-600 cursor-not-allowed"
      />
    </div>
  );
}
