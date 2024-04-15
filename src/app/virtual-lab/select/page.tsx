import { PlusOutlined } from '@ant-design/icons';

export default function VirtualLabSelectPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="font-bold uppercase">Your virtual labs</div>
        <div role="button" className="flex w-[150px] justify-between border border-primary-7 p-3">
          <span className="font-bold">Create virtual lab</span>
          <PlusOutlined />
        </div>
      </div>
    </div>
  );
}
