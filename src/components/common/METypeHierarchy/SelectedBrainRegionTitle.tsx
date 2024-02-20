import { Button } from 'antd';
import { MinusOutlined } from '@ant-design/icons';
import { BrainRegionIcon } from '@/components/icons';

export function SelectedBrainRegionTitle({
  title,
  onClick,
}: {
  title?: string;
  onClick?: () => void;
}) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div className="flex items-center justify-start space-x-2 text-2xl font-bold text-white">
        <BrainRegionIcon style={{ height: '1em' }} />
        <span className="text-secondary-4">{title}</span>
      </div>
      <Button
        type="text"
        icon={<MinusOutlined style={{ color: 'white' }} />}
        onClick={onClick}
        style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
}
