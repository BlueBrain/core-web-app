'use client';

import { useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import SearchInput from './SearchInput';
import ListTypeSelector from './ListTypeSelector';
import { SimulationCampaignUIConfigResource } from '@/types/nexus';
import { simCampaingListAtom, triggerRefetchAtom } from '@/state/experiment-designer';
import ConfigList from '@/components/ConfigList';
import CloneIcon from '@/components/icons/Clone';
import EditIcon from '@/components/icons/Edit';
import useCloneConfigModal from '@/hooks/config-clone-modal';
import useRenameModal from '@/hooks/config-rename-modal';
import {
  cloneSimCampUIConfig,
  renameSimCampUIConfig,
} from '@/services/bbp-workflow/simulationHelper';
import Link from '@/components/Link';
import { EyeIcon } from '@/components/icons';

const { Column } = Table;

const loadableSimCampaignListAtom = loadable(simCampaingListAtom);

export default function SimCampaignList() {
  const router = useRouter();
  const { data: session } = useSession();

  const simCampaignsLoadable = useAtomValue(loadableSimCampaignListAtom);
  const triggerRefetch = useSetAtom(triggerRefetchAtom);

  const [configs, setConfigs] = useState<SimulationCampaignUIConfigResource[]>([]);

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal<SimulationCampaignUIConfigResource>(cloneSimCampUIConfig);
  const { createModal: createRenameModal, contextHolder: renameContextHolder } =
    useRenameModal<SimulationCampaignUIConfigResource>(renameSimCampUIConfig);

  useEffect(() => {
    if (simCampaignsLoadable.state !== 'hasData') return;

    setConfigs(simCampaignsLoadable.data);
  }, [simCampaignsLoadable]);

  const generateRedirectUrl = (config: SimulationCampaignUIConfigResource) => {
    const baseHref = '/experiment-designer/experiment-setup';
    const collapsedId: string = encodeURIComponent(config['@id'].split('/').pop() || '');
    return `${baseHref}?simulationCampaignUIConfigId=${collapsedId}`;
  };

  const openCloneModal = (currentConfig: SimulationCampaignUIConfigResource) => {
    createCloneModal(currentConfig, (clonedConfig: SimulationCampaignUIConfigResource) => {
      triggerRefetch();
      router.push(generateRedirectUrl(clonedConfig));
    });
  };

  const openRenameModal = (config: SimulationCampaignUIConfigResource) => {
    createRenameModal(config, triggerRefetch);
  };

  const nameRenderFn = (name: string, config: SimulationCampaignUIConfigResource) => (
    <Link href={generateRedirectUrl(config)}>{name || 'unnamed'}</Link>
  );

  return (
    <>
      <ListTypeSelector />

      <div className="flex justify-end mb-3">
        <SearchInput />
      </div>

      <ConfigList<SimulationCampaignUIConfigResource>
        isLoading={simCampaignsLoadable.state === 'loading'}
        configs={configs}
        nameRenderFn={nameRenderFn}
      >
        <Column
          title=""
          key="actions"
          width={120}
          render={(config) => (
            <>
              <Button
                size="small"
                type="text"
                className="inline-block mr-2"
                disabled={config._createdBy.split('/').reverse()[0] !== session?.user.username}
                onClick={() => openRenameModal(config)}
              >
                <EditIcon />
              </Button>

              <Button
                size="small"
                type="text"
                className="inline-block mr-2"
                onClick={() => openCloneModal(config)}
              >
                <CloneIcon />
              </Button>

              <Link href={generateRedirectUrl(config)} className="inline-block">
                <Button size="small" type="text">
                  <EyeIcon fill="#FFF" />
                </Button>
              </Link>
            </>
          )}
        />
      </ConfigList>

      {renameContextHolder}
      {cloneContextHolder}
    </>
  );
}
