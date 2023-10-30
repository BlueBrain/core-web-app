import { CopyOutlined, EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';

import { triggerRefetchAllAtom } from './state';
import { BrainModelConfigResource } from '@/types/nexus';
import Link from '@/components/Link';
import { collapseId } from '@/util/nexus';
import useCloneConfigModal from '@/hooks/config-clone-modal';
import useRenameConfigModal from '@/hooks/config-rename-modal';
import { cloneBrainModelConfig, renameBrainModelConfig } from '@/api/nexus';
import timeElapsedFromToday from '@/util/date';
import { getBrainModelConfigsByNameQuery } from '@/queries/es';

type BrainConfigEntryProps = {
  config: BrainModelConfigResource;
  baseHref: string;
};

export default function BrainConfigEntry({ baseHref, config }: BrainConfigEntryProps) {
  const { data: session } = useSession();

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal<BrainModelConfigResource>(
      cloneBrainModelConfig,
      getBrainModelConfigsByNameQuery
    );
  const { createModal: createRenameModal, contextHolder: renameContextHolder } =
    useRenameConfigModal<BrainModelConfigResource>(
      renameBrainModelConfig,
      getBrainModelConfigsByNameQuery
    );
  const triggerRefetchAll = useSetAtom(triggerRefetchAllAtom);

  const uriEncodedId = encodeURIComponent(collapseId(config['@id']));
  const href = `${baseHref}?brainModelConfigId=${uriEncodedId}`;

  const createdAtFormatted = timeElapsedFromToday(config._createdAt);

  const openCloneModal = () => {
    createCloneModal(config, triggerRefetchAll);
  };

  const openRenameModal = () => {
    createRenameModal(config, triggerRefetchAll);
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_max-content] items-start gap-2 !w-full">
        <Link className="inline-flex flex-col items-start group" href={href}>
          <span title={config.name} className="line-clamp-1 group-hover:text-primary-3">
            {config.name}
          </span>
          <small className="text-primary-3 whitespace-nowrap group-hover:text-white">
            {createdAtFormatted}
          </small>
        </Link>

        <div className="text-primary-3 inline-flex items-center justify-between gap-1 w-max">
          <button
            type="button"
            className="text-primary-3 disabled:text-primary-7 disabled:cursor-not-allowed hover:text-white"
            onClick={openRenameModal}
            disabled={config._createdBy.split('/').reverse()[0] !== session?.user.username}
          >
            <EditOutlined className="" />
          </button>

          <button type="button" onClick={openCloneModal}>
            <CopyOutlined className="text-primary-3 hover:text-white" />
          </button>

          <Link href={href}>
            <ArrowRightOutlined className="text-primary-3 hover:text-white" />
          </Link>
        </div>
      </div>

      {renameContextHolder}
      {cloneContextHolder}
    </>
  );
}
