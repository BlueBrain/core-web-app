'use client';

import { ConfigProvider, Modal } from 'antd';

import UserInfoForm from './UserInfoForm';
import { SingleDocumentProps } from '@/types/about/document-download';
import { CloseIcon } from '@/components/icons';
import { classNames } from '@/util/utils';

export default function FormDownloadDocument({
  content,
  formOpen,
  setFormOpen,
}: {
  content: SingleDocumentProps;
  formOpen: boolean;
  setFormOpen: (value: boolean) => void;
}) {
  return (
    <ConfigProvider theme={{ hashed: false }}>
      <Modal
        mask
        centered
        destroyOnClose
        maskClosable
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        title={null}
        footer={null}
        styles={{
          mask: {
            background: '#002766ba',
          },
          body: { padding: '20px' },
        }}
        closeIcon={<CloseIcon className="block h-auto w-4" />}
        className={classNames(
          '!m-0 h-full w-full !max-w-full md:h-auto md:!w-[700px]',
          '[&_.ant-modal-body]:flex [&_.ant-modal-body]:h-full [&_.ant-modal-body]:items-center [&_.ant-modal-body]:justify-center md:[&_.ant-modal-body]:h-auto',
          '[&_.ant-modal-confirm-body]:!w-full [&_.ant-modal-confirm-paragraph]:max-w-full [&_.ant-modal-content]:h-full [&_.ant-modal-content]:!rounded-none'
        )}
      >
        <UserInfoForm content={content} setFormOpen={setFormOpen} />
      </Modal>
    </ConfigProvider>
  );
}
