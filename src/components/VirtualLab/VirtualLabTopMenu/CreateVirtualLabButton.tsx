import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';

export function CreateVirtualLabButton() {
  const { showModal } = useModalState();

  return (
    <Button
      className="h-12 w-52 rounded-none border-none text-sm font-bold text-primary-8"
      size="small"
      onClick={showModal}
    >
      Create Virtual Lab
      <PlusOutlined className="relative bottom-1 left-3" />
    </Button>
  );
}
