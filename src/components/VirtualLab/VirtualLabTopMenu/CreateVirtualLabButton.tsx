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
        className="mr-5 h-12 w-52 rounded-none border-none text-sm font-bold"
        onClick={showModal}
      >
        <span className="relative text-primary-8">
          Create Virtual Lab <PlusOutlined className="relative left-3 top-[0.1rem]" />
        </span>
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
