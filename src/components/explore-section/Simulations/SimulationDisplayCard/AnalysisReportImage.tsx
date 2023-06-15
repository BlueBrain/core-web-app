import {
  ArrowRightOutlined,
  CalendarOutlined,
  DownloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Checkbox } from 'antd';

type AnalysisReportImageProps = {
  src: string;
};

export default function AnalysisReportImage({ src }: AnalysisReportImageProps) {
  const [showDimensionValue, setShowDimensionValue] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div className="mt-4">
      <div className="flex mb-3 justify-between items-center text-primary-7">
        <Checkbox
          onChange={(value) => setShowDimensionValue(value.target.value)}
          value={showDimensionValue}
          className="font-semibold text-primary-7"
        >
          Dimension values
        </Checkbox>
        <button
          onClick={() => router.replace('/explore/simulation-campaigns/test/simulations/test')}
          type="submit"
          className="border radius-none w-max px-2 py-1"
        >
          view simulation detail <ArrowRightOutlined className="ml-3" />
        </button>
      </div>
      <img width="425px" height="260px" src={src} />
      <div className="flex text-primary-7 mt-3 justify-between items-center">
        <div className="flex gap-3">
          <div>
            <UserOutlined />
            <span className="ml-2">Litvak</span>
          </div>
          <div>
            <CalendarOutlined /> 6 days ago
          </div>
        </div>
        <button type="submit" className="border-2 radius-none w-max p-2">
          <DownloadOutlined />
        </button>
      </div>
    </div>
  );
}
