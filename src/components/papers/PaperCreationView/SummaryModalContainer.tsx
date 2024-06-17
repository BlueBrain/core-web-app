import { ReactNode } from 'react';
import { ConfigProvider, Modal } from 'antd';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function SummaryModalContainer({ open, onClose, children }: Props) {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        token: {
          colorBgBase: 'white',
          colorTextBase: 'black',
        },
      }}
    >
      <Modal
        mask
        centered
        maskClosable
        destroyOnClose
        open={open}
        closable={false}
        onCancel={onClose}
        title={null}
        footer={null}
        width={800}
        styles={{
          body: { padding: '20px' },
        }}
      >
        {children}
      </Modal>
    </ConfigProvider>
  );
}
