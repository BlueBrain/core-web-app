import Image from 'next/image';
import {
  ArrowRightOutlined,
  CalendarOutlined,
  DownloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Checkbox } from 'antd';
import FileSaver from 'file-saver';
import Link from '@/components/Link';
import usePathname from '@/hooks/pathname';
import timeElapsedFromToday from '@/util/date';
import { buildSimulationDetailURL } from '@/components/explore-section/Simulations/utils';

type AnalysisReportImageProps = {
  title: string;
  id: string;
  project: string;
  blob: Blob;
  createdAt: string;
  createdBy: string;
};

export default function AnalysisReportImage({
  id,
  project,
  blob,
  createdAt,
  createdBy,
  title,
}: AnalysisReportImageProps) {
  const [showDimensionValue, setShowDimensionValue] = useState<boolean>(false);
  const pathname = usePathname();
  const [proj, org] = project.split('/').reverse();
  const createdByUsername = createdBy?.split('/').reverse()[0];

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between text-primary-7">
        <Checkbox
          onChange={() => setShowDimensionValue(!showDimensionValue)}
          checked={showDimensionValue}
          className="font-semibold text-primary-7"
        >
          {title}
        </Checkbox>
        <Link
          className="radius-none w-max border px-2 py-1"
          href={buildSimulationDetailURL(org, proj, id, pathname)}
        >
          view simulation detail <ArrowRightOutlined className="ml-3" />
        </Link>
      </div>
      <Image alt={id} src={URL.createObjectURL(blob)} height={260} width={425} />
      <div className="mt-3 flex items-center justify-between text-primary-7">
        <div className="flex gap-3">
          <div>
            <UserOutlined />
            <span className="ml-2 capitalize">{createdByUsername}</span>
          </div>
          <div>
            <CalendarOutlined /> {timeElapsedFromToday(createdAt)}
          </div>
        </div>
        <button
          type="button"
          className="radius-none w-max border-2 p-2"
          onClick={() => FileSaver.saveAs(blob)}
          aria-label="Download report image"
        >
          <DownloadOutlined />
        </button>
      </div>
    </div>
  );
}
