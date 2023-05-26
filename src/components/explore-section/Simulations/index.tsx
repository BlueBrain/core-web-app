import { Space } from 'antd';
import { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { AxesState, DeltaResource } from '@/types/explore-section';
import DisplayDropdown from '@/components/explore-section/Simulations/DisplayDropdown';
import DimensionSelector from '@/components/explore-section/Simulations/DimensionSelector';
import AnalysisReportGrid from '@/components/explore-section/Simulations/AnalysisReportGrid';
import CenteredMessage from '@/components/CenteredMessage';
import JobStatus from '@/components/explore-section/Simulations/JobStatus';
import rasterImage from '@/components/explore-section/Simulations/raster.jpg';
import imageryImage from '@/components/explore-section/Simulations/imagery.jpg';
import voltageImage from '@/components/explore-section/Simulations/voltage.jpg';

export default function Simulations({ resource }: { resource: DeltaResource }) {
  const [selectedDisplay, setSelectedDisplay] = useState('raster');
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
            <AnalysisReportGrid
              xDimension={selectedXAxis}
              yDimension={selectedYAxis}
              image={<img src={rasterImage.src} alt="Displays a raster graph" />}
            />
          </>
        );
      case 'status':
        return <JobStatus resource={resource} />;
      case 'voltage':
        return (
          <>
            <DimensionSelector resource={resource} axes={axes} setAxes={setAxes} />
            <AnalysisReportGrid
              xDimension={selectedXAxis}
              yDimension={selectedYAxis}
              image={<img src={voltageImage.src} alt="Displays a voltage analysis" />}
            />
          </>
        );
      case 'imagery':
        return (
          <>
            <DimensionSelector resource={resource} axes={axes} setAxes={setAxes} />
            <AnalysisReportGrid
              xDimension={selectedXAxis}
              yDimension={selectedYAxis}
              image={<img src={imageryImage.src} alt="Displays an imagery report" />}
            />
          </>
        );
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
