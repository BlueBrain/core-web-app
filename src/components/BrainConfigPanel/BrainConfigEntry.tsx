import { CopyOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useSetAtom } from 'jotai';

import { triggerRefetchAllAtom } from './state';
import { BrainModelConfigResource } from '@/types/nexus';
import Link from '@/components/Link';
import { collapseId } from '@/util/nexus';
import useCloneConfigModal from '@/hooks/brain-config-clone-modal';

type BrainConfigEntryProps = {
  config: BrainModelConfigResource;
  baseHref: string;
};

export default function BrainConfigEntry({ baseHref, config }: BrainConfigEntryProps) {
  const { showModal, contextHolder } = useCloneConfigModal();
  const refetchConfigs = useSetAtom(triggerRefetchAllAtom);

  const uriEncodedId = encodeURIComponent(collapseId(config['@id']));
  const href = `${baseHref}?brainModelConfigId=${uriEncodedId}`;

  const createdAtFormatted = moment(config._createdAt).fromNow();

  const openCloneModal = () => {
    showModal(config, refetchConfigs);
  };

  return (
    <>
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

          <button type="button" onClick={openCloneModal}>
            <CopyOutlined className="text-primary-3" />
          </button>

          <Link href={href}>
            <ArrowRightOutlined className="text-primary-3" />
          </Link>
        </div>
      </div>

      {contextHolder}
    </>
  );
}
