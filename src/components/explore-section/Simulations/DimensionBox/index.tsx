import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import {
  DimensionBoxProps,
  DimensionTitleProps,
  Status,
} from '@/components/explore-section/Simulations/types';
import AssignedDimensionBox from '@/components/explore-section/Simulations/DimensionBox/AssignedDimensionBox';
import UnassignedDimensionBox from '@/components/explore-section/Simulations/DimensionBox/UnassignedDimensionBox';
import { ensureArray } from '@/util/nexus';

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
          <div className="flex flex-row align-center text-primary-6">
            <span>Edit axis</span>
            <EditOutlined className="ml-2" />
          </div>
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
  isAxis,
  possibleValues,
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
    <Tooltip title={dimension && <div>Values: {ensureArray(possibleValues)?.join(',')}</div>}>
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
          <AssignedDimensionBox dimension={dimension} isAxis={isAxis} />
        ) : (
          <UnassignedDimensionBox
            dimensionOptions={dimensionOptions}
            setAxis={setAxis}
            setStatus={setStatus}
            status={status}
          />
        )}
      </div>
    </Tooltip>
  );
}
