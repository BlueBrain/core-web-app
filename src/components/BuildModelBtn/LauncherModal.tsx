import { Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

import ExecutionStatus from '@/components/ExecutionStatus';

type Props = {
  isOpen: boolean;
  onCloseModal: any;
  container: any;
  loading: boolean;
  children: ReactNode;
};

export default function LauncherModal({
  isOpen = false,
  onCloseModal,
  container,
  loading = false,
  children,
}: Props) {
  // ideally we should use bg-blue-7
  const maskStyle = { backgroundColor: '#0050B3D9' };

  const antLoadingIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  if (loading) {
    return (
      <Modal
        title={<h1 className="text-blue-7">Building</h1>}
        footer={null}
        open={isOpen}
        onCancel={() => onCloseModal(false)}
        maskStyle={maskStyle}
        getContainer={container}
      >
        <span className="text-blue-7">Your model is being built. This can take up to 4 days.</span>
        <div className="flex flex-col items-center">
          <h4 className="mt-20 mb-10 text-blue-7">148 hours elapsed</h4>
          <Spin indicator={antLoadingIcon} />
          <button type="button" className="bg-blue-1 text-blue-9 h-12 px-8 mt-10 mb-20">
            Cancel
          </button>
        </div>
      </Modal>
    );
  }

  const footer = (
    <>
      <button onClick={() => onCloseModal(false)} type="button" className="text-black h-12 px-8">
        Cancel
      </button>

      {/* THE button to launch workflow */}
      {children}
    </>
  );

  return (
    <Modal
      title={<h1 className="text-blue-7">Build your model</h1>}
      footer={footer}
      open={isOpen}
      onCancel={() => onCloseModal(false)}
      maskStyle={maskStyle}
      getContainer={container}
    >
      <div className="text-blue-7 mb-4 mt-4">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde id vitae natus minima quam,
        necessitatibus atque eligendi reprehenderit accusantium, delectus veniam dolorum a nesciunt
        ipsam minus, ut beatae porro ad?
      </div>

      <ExecutionStatus />
    </Modal>
  );
}
