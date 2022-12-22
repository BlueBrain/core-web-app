import { CopyOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';

import { BrainModelConfig } from '@/types/nexus';
import Link from '@/components/Link';
import { collapseId } from '@/util/nexus';

type BrainConfigEntryProps = {
  config: BrainModelConfig;
  baseHref: string;
};

export default function BrainConfigEntry({ baseHref, config }: BrainConfigEntryProps) {
  const uriEncodedId = encodeURIComponent(collapseId(config['@id']));
  const href = `${baseHref}?brainModelConfigId=${uriEncodedId}`;

  const createdAtFormatted = moment(config._createdAt).fromNow();

  return (
    <div className="flex justify-between items-center">
      <Link className="inline-flex items-baseline max-w-[190px]" href={href}>
        <span title={config.name} className="overflow-hidden text-ellipsis whitespace-pre flex-1">
          {config.name}
        </span>
        <small className="text-primary-3 ml-2 whitespace-nowrap">{createdAtFormatted}</small>
      </Link>

      <div className="text-primary-3 space-x-2">
        <button type="button">
          <EditOutlined className="text-primary-3" />
        </button>

        <button type="button">
          <CopyOutlined className="text-primary-3" />
        </button>

        <Link href={href}>
          <ArrowRightOutlined className="text-primary-3" />
        </Link>
      </div>
    </div>
  );
}
