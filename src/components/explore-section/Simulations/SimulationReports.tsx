import { useMemo } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ImageReport from './ImageReport';
import { analysisReportsFamily } from '@/state/explore-section/simulation-campaign';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { useUnwrappedValue } from '@/hooks/hooks';

export default function SimulationReports() {
  const resourceInfo = useResourceInfoFromPath();
  const reports = useUnwrappedValue(analysisReportsFamily(resourceInfo));
  const reportImageFiles = useMemo(
    () => reports?.filter((r) => r.simulation === resourceInfo?.id),
    [reports, resourceInfo?.id]
  );

  if (reportImageFiles) {
    return (
      <div className="text-primary-7 mt-7">
        <div className="text-primary-7">
          <span className="text-2xl font-bold">Reports</span>
          <span className="ml-3 text-xs">({reportImageFiles?.length})</span>
        </div>

        <div className="grid grid-cols-3 mt-4">
          {reportImageFiles?.map(({ blob, name }) => (
            <ImageReport key={name} imageSource={URL.createObjectURL(blob)} title={name} />
          ))}
        </div>
      </div>
    );
  }
  return <Spin indicator={<LoadingOutlined />} />;
}
