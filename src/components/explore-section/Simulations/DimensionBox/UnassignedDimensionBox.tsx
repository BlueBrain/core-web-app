import { Button, Select } from 'antd';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { UnassignedDimensionBoxProps } from '@/components/explore-section/Simulations/types';

export default function UnassignedDimensionBox({
  dimensionOptions,
  setAxis,
  status,
  setStatus,
}: UnassignedDimensionBoxProps) {
  if (status === 'selection') {
    return (
      <Select
        bordered={false}
        style={{ width: '100%' }}
        className="top-1/4 border-b border-solid border-neutral-6"
        placeholder="Search dimension..."
        options={dimensionOptions}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        showSearch
        optionFilterProp="label"
        onSelect={setAxis}
        suffixIcon={<SearchOutlined className="text-neutral-6" />}
      />
    );
  }
  return (
    <Button
      className="top-1/4 m-auto flex items-center text-primary-7"
      type="link"
      icon={<PlusCircleOutlined />}
      onClick={() => setStatus('selection')}
    >
      Assign dimension
    </Button>
  );
}
