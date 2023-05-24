import { Space } from 'antd';
import { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { AxesState, DeltaResource } from '@/types/explore-section';
import DisplayDropdown from '@/components/explore-section/Simulations/DisplayDropdown';
import DimensionSelector from '@/components/explore-section/Simulations/DimensionSelector';
import RasterDisplay from '@/components/explore-section/Simulations/RasterDisplay';
import CenteredMessage from '@/components/CenteredMessage';
import JobStatus from '@/components/explore-section/Simulations/JobStatus';

export default function Simulations({ resource }: { resource: DeltaResource }) {
  const [selectedDisplay, setSelectedDisplay] = useState('status');
  const [axes, setAxes] = useState<AxesState>({
    xAxis: undefined,
    yAxis: undefined,
  });

  const selectedXAxis = resource.dimensions?.find((dim) => dim.label === axes.xAxis);
  const selectedYAxis = resource.dimensions?.find((dim) => dim.label === axes.yAxis);

  const renderDisplay = () => {
    switch (selectedDisplay) {
      case 'raster':
        return (
          <>
            <DimensionSelector resource={resource} axes={axes} setAxes={setAxes} />
            <RasterDisplay xDimension={selectedXAxis} yDimension={selectedYAxis} />
          </>
        );

      case 'status':
        return <JobStatus resource={resource} />;

      default:
        return (
          <CenteredMessage
            message="This display is not implemented yet"
            icon={<InfoCircleOutlined className="text-7xl" />}
          />
        );
    }
  };

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2">
        <div className="text-primary-7">
          <Space>
            <span className="font-bold text-xl">Simulations</span>
            <span className="text-xs">4200 simulations</span>
          </Space>
        </div>
        <div>
          <Space className="float-right">
            <span className="text-neutral-4">Display:</span>
            <DisplayDropdown
              setSelectedDisplay={setSelectedDisplay}
              selectedDisplay={selectedDisplay}
            />
          </Space>
        </div>
      </div>
      <div className="mt-4">{renderDisplay()}</div>
    </div>
  );
}
