import { LoadingOutlined } from '@ant-design/icons';

export default function LoadingSpinner() {
  // TODO: this will change for a nicer spinner soon
  return (
    <div className="flex h-full items-center justify-center text-3xl text-neutral-1">
      <LoadingOutlined />
    </div>
  );
}
