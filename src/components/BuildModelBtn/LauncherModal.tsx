import { Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

import ExecutionStatus from '@/components/ExecutionStatus';
import GenericButton from '@/components/Global/GenericButton';

type Props = {
  isOpen: boolean;
  onCloseModal: any;
  loading: boolean;
  children: ReactNode;
};

export default function LauncherModal({
  isOpen = false,
  onCloseModal,
  loading = false,
  children,
}: Props) {
  // ideally we should use bg-primary-7
  const maskStyle = { backgroundColor: '#0050B3D9' };

  const antLoadingIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  const onClose = () => onCloseModal(false);

  if (loading) {
    return (
      <Modal
        title={<h1 className="text-primary-7">Building</h1>}
        footer={null}
        open={isOpen}
        onCancel={onClose}
        styles={{ mask: maskStyle }}
        maskClosable={false}
      >
        <div className="flex flex-col items-center">
          <h4 className="mb-2 mt-20 text-primary-7">We are setting up a couple of things...</h4>
          <h4 className="mb-2 mt-2 text-primary-7">Please wait</h4>
          <Spin indicator={antLoadingIcon} />
          <GenericButton
            className="mb-20 mt-10 bg-primary-1 text-primary-9"
            onClick={onClose}
            text="Cancel"
          />
        </div>
      </Modal>
    );
  }

  const footer = (
    <>
      <GenericButton onClick={onClose} text="Cancel" className="text-black" />

      {/* THE button to launch workflow */}
      {children}
    </>
  );

  return (
    <Modal
      title={<h1 className="text-primary-7">Build your model</h1>}
      footer={footer}
      open={isOpen}
      onCancel={() => onCloseModal(false)}
      styles={{ mask: maskStyle }}
    >
      <div className="mb-4 mt-4 text-primary-7">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde id vitae natus minima quam,
        necessitatibus atque eligendi reprehenderit accusantium, delectus veniam dolorum a nesciunt
        ipsam minus, ut beatae porro ad?
      </div>

      <ExecutionStatus />
    </Modal>
  );
}
