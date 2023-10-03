import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { Spin } from 'antd';
import { unwrap } from 'jotai/utils';
import { LoadingOutlined } from '@ant-design/icons';
import ImageReport from './ImageReport';
import { reportImageFilesAtom } from '@/state/explore-section/simulation-campaign';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function SimulationReports() {
  const resourceInfo = useResourceInfoFromPath();

  const reportImageFiles = useAtomValue(
    useMemo(() => unwrap(reportImageFilesAtom(resourceInfo)), [resourceInfo])
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
