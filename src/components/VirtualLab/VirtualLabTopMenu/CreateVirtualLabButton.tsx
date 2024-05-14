import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { VirtualLabCreateInformation, VirtualLabCreatePlan } from '../create';
import {
  ModalStateProvider,
  useModalState,
} from '@/components/VirtualLab/create/contexts/ModalStateContext';

export function CreateVirtualLabButton() {
  return (
    <ModalStateProvider>
      <CreateVirtualLabButtonContent />
    </ModalStateProvider>
  );
}

function CreateVirtualLabButtonContent() {
  const { showModal, isModalVisible, currentStep, handleOk, handleCancel } = useModalState();

  return (
    <>
      <Button
        size="small"
        className="h-full w-52 rounded-none border-none py-4 text-sm font-bold text-white"
        type="link"
        onClick={showModal}
      >
        Create Virtual Lab
        <PlusOutlined className="relative bottom-1 left-3" />
      </Button>
      <Modal
        title={null}
        open={isModalVisible}
        width={800}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {currentStep === 'information' && <VirtualLabCreateInformation />}
        {currentStep === 'plan' && <VirtualLabCreatePlan />}
      </Modal>
    </>
  );
}
