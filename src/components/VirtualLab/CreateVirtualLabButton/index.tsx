import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import CreateVirtualLabModal from './CreateVirtualLabModal';
import { useAtom } from '@/state/state';

export default function CreateVirtualLabButton() {
  const [, setIsModalVisible] = useAtom<boolean>('new-vlab-modal-open');
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

      <CreateVirtualLabModal />
    </>
  );
}
