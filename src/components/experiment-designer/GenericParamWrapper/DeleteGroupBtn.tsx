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
          'invisible group-hover:visible self-end border-b-0 cursor-pointer text-red-500 mr-2 px-1',
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
        bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        maskStyle={{ backgroundColor: '#002766bf' }}
        width={350}
      >
        <WarningOutlined className="text-red-600 text-7xl mb-6" />
        <div className="text-center text-2xl mb-6">Are you sure you want to remove this group?</div>
        <button className="bg-black text-white mb-2 px-6 py-2" type="button" onClick={handleOk}>
          Delete
        </button>
        <button className="p-4" type="button" onClick={handleCancel}>
          Cancel
        </button>
      </Modal>
    </>
  );
}
