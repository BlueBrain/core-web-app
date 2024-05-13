import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';

export function CreateVirtualLabButton() {
  const { showModal } = useModalState();

  return (
    <Button
      className="w-52 border-none font-bold text-primary-8"
      style={{ borderRadius: 0, fontSize: 12, height: 40 }}
      size="small"
      onClick={showModal}
    >
      Create Virtual Lab
      <PlusOutlined className="relative bottom-1 left-3" />
    </Button>
  );
}
