import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';

export function CreateVirtualLabButton() {
  const { showModal } = useModalState();

  return (
    <Button
      className="z-1 fixed w-52 border-none py-4 font-bold text-white"
      style={{ bottom: 20, right: 20 }}
      type="link"
      onClick={showModal}
    >
      Create Virtual Lab
      <PlusOutlined className="relative bottom-1 left-3" />
    </Button>
  );
}
