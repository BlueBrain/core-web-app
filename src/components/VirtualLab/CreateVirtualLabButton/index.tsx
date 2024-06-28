import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import CreateVirtualLabModal from './CreateVirtualLabModal';

export default function CreateVirtualLabButton() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  return (
    <>
      <Button
        className="mr-5 h-12 w-52 rounded-none border-none text-sm font-bold"
        onClick={() => setIsModalVisible(true)}
      >
        <span className="relative text-primary-8">
          Create virtual lab <PlusOutlined className="relative left-3 top-[0.1rem]" />
        </span>
      </Button>
      <Modal
        title={null}
        open={isModalVisible}
        width={800}
        onOk={() => {}}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <CreateVirtualLabModal closeModalFn={() => setIsModalVisible(false)} />
      </Modal>
    </>
  );
}
