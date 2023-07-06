import { Switch } from 'antd';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { ReactNode, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';

import { OrientationInterface, OrientationToDisplay } from '@/types/m-model';

type OrientationDirection = 'up' | 'down' | 'left' | 'right';
type OrientationAxis = 'x' | 'y';

type RowProps = {
  children: ReactNode;
  axisName: OrientationAxis;
  onAxisChange: (axisName: OrientationAxis, isChecked: boolean) => void;
  orientationData: OrientationInterface;
};

function Row({ children, axisName, onAxisChange, orientationData }: RowProps) {
  const isChecked = !!orientationData[axisName === 'x' ? 0 : 1];

  return (
    <div className="flex items-center gap-2">
      <div className="font-bold">{axisName.toUpperCase()}</div>
      <input
        type="checkbox"
        onChange={(e) => onAxisChange(axisName, e.target.checked)}
        checked={isChecked}
      />
      <div className="grow text-end">Direction</div>
      <div>{children}</div>
    </div>
  );
}

type Props = {
  paramValue: OrientationInterface;
  paramInfo: OrientationToDisplay;
  onChange: (newValue: OrientationInterface) => void;
};

export default function OrientationParam({ paramValue, paramInfo, onChange }: Props) {
  const { displayName } = paramInfo;
  const [orientationData, setOrientationData] = useState<OrientationInterface>(paramValue);

  const xDirectionIsChecked = orientationData[0] === 1;
  const yDirectionIsChecked = orientationData[1] === 1;

  useEffect(() => {
    if (!paramValue) return;

    setOrientationData(paramValue);
  }, [paramValue, setOrientationData]);

  useEffect(() => {
    if (!orientationData) return;
    if (isEqual(paramValue, orientationData)) return;

    onChange(orientationData);
  }, [orientationData, onChange, paramValue]);

  const onAxisChange = (axis: OrientationAxis, isChecked: boolean) => {
    const index = axis === 'x' ? 0 : 1;
    setOrientationData((oldData) => {
      const newData = [...oldData] as OrientationInterface;
      newData[index] = isChecked ? 1 : 0;
      return newData;
    });
  };

  const onDirectionChange = (axis: OrientationAxis, newDirection: OrientationDirection) => {
    const index = axis === 'x' ? 0 : 1;
    const possitiveDirection = newDirection === 'left' || newDirection === 'up';
    setOrientationData((oldData) => {
      const newData = [...oldData] as OrientationInterface;
      newData[index] = possitiveDirection ? 1 : -1;
      return newData;
    });
  };

  return (
    <div>
      <div className="flex flex-col">
        <div>{displayName}</div>
        <Row axisName="x" onAxisChange={onAxisChange} orientationData={orientationData}>
          <Switch
            onChange={(checked: boolean) => {
              onDirectionChange('x', checked ? 'left' : 'right');
            }}
            checkedChildren={<ArrowRightOutlined />}
            unCheckedChildren={<ArrowLeftOutlined />}
            checked={xDirectionIsChecked}
          />
        </Row>
        <Row axisName="y" onAxisChange={onAxisChange} orientationData={orientationData}>
          <Switch
            onChange={(checked: boolean) => {
              onDirectionChange('y', checked ? 'up' : 'down');
            }}
            checkedChildren={<ArrowUpOutlined />}
            unCheckedChildren={<ArrowDownOutlined />}
            checked={yDirectionIsChecked}
          />
        </Row>
      </div>
    </div>
  );
}
