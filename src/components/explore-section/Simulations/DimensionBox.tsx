import { useState } from 'react';
import { Button, Select } from 'antd';
import { CloseOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  AssignedDimensionBoxProps,
  DimensionBoxProps,
  DimensionTitleProps,
  Status,
  UnassignedDimensionBoxProps,
} from '@/components/explore-section/Simulations/types';

function UnassignedDimensionBox({
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
        className="border-solid border-b border-neutral-6 top-1/4"
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
      className="m-auto flex items-center text-primary-7 top-1/4"
      type="link"
      icon={<PlusCircleOutlined />}
      onClick={() => setStatus('selection')}
    >
      Assign dimension
    </Button>
  );
}

function AssignedDimensionBox({
  dimension,
  dismissFunc,
  dismissible,
  hovered,
}: AssignedDimensionBoxProps) {
  const toolsVisible = hovered && dimension !== undefined && dismissible;
  return (
    <>
      <div className="flex flex-row justify-between">
        <div>{dimension?.label}</div>
        {toolsVisible && (
          <div className="float-right">
            <CloseOutlined onClick={dismissFunc} />
          </div>
        )}
      </div>
      <div className="mt-3 h-min w-min px-2 py-1 bg-sky-100 font-bold">
        {dimension.value.join(',')}
      </div>
    </>
  );
}

function DimensionTitle({ title, dismissible, dismissFunc, setStatus }: DimensionTitleProps) {
  return (
    <div className="text-base text-primary-7">
      <span className="font-bold">{title}</span>
      {dismissible && title && (
        <Button
          type="link"
          className="text-xs text-primary-7 "
          onClick={() => {
            dismissFunc?.();
            setStatus('selection');
          }}
        >
          Edit axes <EditOutlined />
        </Button>
      )}
    </div>
  );
}

export default function DimensionBox({
  dimension,
  title,
  dimensionOptions,
  setAxis,
  dismissFunc,
  dismissible,
}: DimensionBoxProps) {
  const [status, setStatus] = useState<Status>('initial');
  const [hovered, setHovered] = useState(false);

  const renderMargin = () => {
    if (title && !dismissible) {
      return 'mt-3';
    }
    if (!title) {
      return 'mt-9';
    }
    return '';
  };

  return (
    <>
      <DimensionTitle
        dismissFunc={dismissFunc}
        title={title}
        dismissible={dismissible}
        setStatus={setStatus}
      />
      <div
        className={`gap-1 h-24 border rounded border-primary-1 py-2.5 px-3.5 text-primary-7 ${renderMargin()}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {dimension ? (
          <AssignedDimensionBox
            dimension={dimension}
            dismissFunc={dismissFunc}
            dismissible={dismissible}
            hovered={hovered}
          />
        ) : (
          <UnassignedDimensionBox
            dimensionOptions={dimensionOptions}
            setAxis={setAxis}
            setStatus={setStatus}
            status={status}
          />
        )}
      </div>
    </>
  );
}
