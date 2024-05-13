import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';
import { classNames } from '@/util/utils';

type Props = {
  extraClasses?: string;
};

export function CreateVirtualLabButton({ extraClasses = 'text-white' }: Props) {
  const { showModal } = useModalState();

  return (
    <Button
      size="small"
      className={classNames(
        'h-12 h-full w-52 rounded-none border-none py-4 text-sm font-bold',
        extraClasses
      )}
      type="link"
      onClick={showModal}
    >
      Create Virtual Lab
      <PlusOutlined className="relative bottom-1 left-3" />
    </Button>
  );
}
