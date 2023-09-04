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
  const createdByUsername = createdBy.split('/').reverse()[0];

  return (
    <div className="mt-4">
      <div className="flex mb-3 justify-between items-center text-primary-7">
        <Checkbox
          onChange={() => setShowDimensionValue(!showDimensionValue)}
          checked={showDimensionValue}
          className="font-semibold text-primary-7"
        >
          {title}
        </Checkbox>
        <Link
          className="border radius-none w-max px-2 py-1"
          href={buildSimulationDetailURL(org, proj, id, pathname)}
        >
          view simulation detail <ArrowRightOutlined className="ml-3" />
        </Link>
      </div>
      <Image alt={id} src={URL.createObjectURL(blob)} height={260} width={425} />
      <div className="flex text-primary-7 mt-3 justify-between items-center">
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
          className="border-2 radius-none w-max p-2"
          onClick={() => FileSaver.saveAs(blob)}
        >
          <DownloadOutlined />
        </button>
      </div>
    </div>
  );
}
