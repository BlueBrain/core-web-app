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
import { to64 } from '@/util/common';
import usePathname from '@/hooks/pathname';

type AnalysisReportImageProps = {
  id: string;
  project: string;
  blob: Blob;
};

export default function AnalysisReportImage({ id, project, blob }: AnalysisReportImageProps) {
  const [showDimensionValue, setShowDimensionValue] = useState<boolean>(false);

  const pathname = usePathname();

  const [proj, org] = project.split('/').reverse();
  const simulationPath = to64(`${org}/${proj}!/!${id}`);

  return (
    <div className="mt-4">
      <div className="flex mb-3 justify-between items-center text-primary-7">
        <Checkbox
          onChange={() => setShowDimensionValue(!showDimensionValue)}
          checked={showDimensionValue}
          className="font-semibold text-primary-7"
        >
          Dimension values
        </Checkbox>
        <Link className="border radius-none w-max px-2 py-1" href={`${pathname}/${simulationPath}`}>
          view simulation detail <ArrowRightOutlined className="ml-3" />
        </Link>
      </div>
      <Image alt={id} src={URL.createObjectURL(blob)} height={260} width={425} />
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
