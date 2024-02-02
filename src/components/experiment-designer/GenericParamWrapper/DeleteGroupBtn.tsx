import { Modal } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { useState } from 'react';

import { classNames } from '@/util/utils';

type Props = {
  className?: string;
  onDelete: any;
};

export default function DeleteGroupBtn({ onDelete = () => {}, className }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    onDelete();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={classNames(
          'invisible mr-2 cursor-pointer self-end border-b-0 px-1 text-red-500 group-hover:visible',
          className
        )}
      >
        <DeleteOutlined onClick={showModal} />
      </div>

      <Modal
        title={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
        styles={{
          body: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
          mask: { backgroundColor: '#002766bf' },
        }}
        width={350}
      >
        <WarningOutlined className="mb-6 text-7xl text-red-600" />
        <div className="mb-6 text-center text-2xl">Are you sure you want to remove this group?</div>
        <button className="mb-2 bg-black px-6 py-2 text-white" type="button" onClick={handleOk}>
          Delete
        </button>
        <button className="p-4" type="button" onClick={handleCancel}>
          Cancel
        </button>
      </Modal>
    </>
  );
}
