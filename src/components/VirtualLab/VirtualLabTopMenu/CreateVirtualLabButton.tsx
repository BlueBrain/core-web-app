import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';
import { classNames } from '@/util/utils';
import { VirtualLabCreateInformation, VirtualLabCreatePlan } from '../create';

type Props = {
  extraClasses?: string;
};

export function CreateVirtualLabButton({ extraClasses = 'text-white' }: Props) {
  const { showModal, isModalVisible, currentStep, handleOk, handleCancel } = useModalState();

  return (
    <>
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
