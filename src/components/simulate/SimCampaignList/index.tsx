'use client';

import { useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { Table, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { SimulationCampaignUIConfigResource } from '@/types/nexus';
import { triggerRefetchAtom } from '@/state/experiment-designer';
import { simCampaignListAtom } from '@/state/simulate';
import ConfigList from '@/components/ConfigList';
import CloneIcon from '@/components/icons/Clone';
import EditIcon from '@/components/icons/Edit';
import useCloneConfigModal from '@/hooks/config-clone-modal';
import useRenameModal from '@/hooks/config-rename-modal';
import { cloneSimCampUIConfig, renameSimCampUIConfig } from '@/api/nexus';
import Link from '@/components/Link';
import { EyeIcon } from '@/components/icons';
import { getSimCampUIConfigsByNameQuery } from '@/queries/es';

const { Column } = Table;

const loadableSimCampaignListAtom = loadable(simCampaignListAtom);

export default function SimCampaignList() {
  const router = useRouter();
  const { data: session } = useSession();

  const simCampaignsLoadable = useAtomValue(loadableSimCampaignListAtom);
  const triggerRefetch = useSetAtom(triggerRefetchAtom);

  const [configs, setConfigs] = useState<SimulationCampaignUIConfigResource[]>([]);

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal<SimulationCampaignUIConfigResource>(
      cloneSimCampUIConfig,
      getSimCampUIConfigsByNameQuery
    );
  const { createModal: createRenameModal, contextHolder: renameContextHolder } =
    useRenameModal<SimulationCampaignUIConfigResource>(
      renameSimCampUIConfig,
      getSimCampUIConfigsByNameQuery
    );

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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-bold">My simulation configurations</h3>
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
                className="mr-2 inline-block"
                disabled={config._createdBy.split('/').reverse()[0] !== session?.user.username}
                onClick={() => openRenameModal(config)}
              >
                <EditIcon />
              </Button>

              <Button
                size="small"
                type="text"
                className="mr-2 inline-block"
                onClick={() => openCloneModal(config)}
              >
                <CloneIcon />
              </Button>

              <Link href={generateRedirectUrl(config)} className="inline-block">
                <Button size="small" type="text" className="text-white">
                  <EyeIcon />
                </Button>
              </Link>
            </>
          )}
        />
      </ConfigList>

      {renameContextHolder}
      {cloneContextHolder}
    </div>
  );
}
