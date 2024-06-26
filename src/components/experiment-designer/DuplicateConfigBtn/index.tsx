import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';

import { cloneSimCampUIConfig } from '@/api/nexus';
import useCloneConfigModal from '@/hooks/config-clone-modal';
import { SimulationCampaignUIConfigResource } from '@/types/nexus';
import { configResourceAtom } from '@/state/experiment-designer';
import { classNames } from '@/util/utils';
import { getSimCampUIConfigsByNameQuery } from '@/queries/es';
import GenericButton from '@/components/Global/GenericButton';
import { collapseId } from '@/util/nexus';

const loadableSimCampUIConfigAtom = loadable(configResourceAtom);

type Props = {
  className?: string;
};

export default function DuplicateConfigBtn({ className }: Props) {
  const router = useRouter();
  const simCampUIConfigLoadable = useAtomValue(loadableSimCampUIConfigAtom);

  const simCampUIConfig =
    simCampUIConfigLoadable.state === 'hasData' ? simCampUIConfigLoadable.data : null;

  const { createModal: createCloneModal, contextHolder: cloneContextHolder } =
    useCloneConfigModal<SimulationCampaignUIConfigResource>(
      cloneSimCampUIConfig,
      getSimCampUIConfigsByNameQuery
    );

  const replaceConfigQueryParam = (clonedConfigId: string) => {
    const collapsedSimCampUIConfigInAtom = collapseId(clonedConfigId || '');
    if (!collapsedSimCampUIConfigInAtom) return;

    const newSearchParams = new URLSearchParams();
    newSearchParams.set('simulationCampaignUIConfigId', collapsedSimCampUIConfigInAtom);
    const seachParamsStr = newSearchParams.toString();
    const baseUrl = window.location.origin + window.location.pathname;
    const newUrl = `${baseUrl}?${seachParamsStr}`;
    router.replace(newUrl);
  };

  const openCloneModal = (currentConfig: SimulationCampaignUIConfigResource) => {
    createCloneModal(currentConfig, (clonedConfig: SimulationCampaignUIConfigResource) => {
      replaceConfigQueryParam(clonedConfig['@id']);
    });
  };

  const style = classNames(className, 'bg-secondary-2 text-white');

  return (
    <>
      <GenericButton
        className={style}
        onClick={() => (simCampUIConfig ? openCloneModal(simCampUIConfig) : () => {})}
        text="Duplicate"
      />

      {cloneContextHolder}
    </>
  );
}
