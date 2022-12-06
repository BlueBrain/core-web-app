import { CopyOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons';

import { BrainConfig } from './types';
import Link from '@/components/Link';

type BrainConfigEntryProps = {
  brainConfig: BrainConfig;
  baseHref: string;
};

export default function BrainConfigEntry({ baseHref, brainConfig }: BrainConfigEntryProps) {
  return (
    <div className="flex justify-between items-center">
      <Link href={`${baseHref}?brainConfigId=${encodeURIComponent(brainConfig.id)}`}>
        {brainConfig.name}
        <small className="text-primary-3 ml-2">{brainConfig.createdAt}</small>
      </Link>

      <div className="text-primary-3 space-x-2">
        <button type="button">
          <EditOutlined className="text-primary-3" />
        </button>

        <button type="button">
          <CopyOutlined className="text-primary-3" />
        </button>

        <Link href={`${baseHref}?brainConfigId=${encodeURIComponent(brainConfig.id)}`}>
          <ArrowRightOutlined className="text-primary-3" />
        </Link>
      </div>
    </div>
  );
}
