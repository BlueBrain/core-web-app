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
      <Link href={href}>
        {config.name}
        <small className="text-primary-3 ml-2">{createdAtFormatted}</small>
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
