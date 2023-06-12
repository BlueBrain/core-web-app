import { useState } from 'react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import {
  DimensionBoxProps,
  DimensionTitleProps,
  Status,
} from '@/components/explore-section/Simulations/types';
import AssignedDimensionBox from '@/components/explore-section/Simulations/DimensionBox/AssignedDimensionBox';
import UnassignedDimensionBox from '@/components/explore-section/Simulations/DimensionBox/UnassignedDimensionBox';

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
        className={`gap-1 h-28 border rounded border-primary-1 py-2.5 px-3.5 text-primary-7 ${renderMargin()}`}
      >
        {dimension ? (
          <AssignedDimensionBox dimension={dimension} />
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
