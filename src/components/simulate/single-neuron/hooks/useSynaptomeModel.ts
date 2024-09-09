import { useEffect, useRef } from 'react';
import { useSetAtom } from 'jotai';

import { useModel } from '@/hooks/useModel';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';
import { useModelConfiguration } from '@/hooks/useModelConfiguration';
import { SynaptomeSimulationInstanceAtom } from '@/state/simulate/categories/simulation-model';
import { SynaptomeConfigDistribution } from '@/types/synaptome';

import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import useSynaptomeSimulationConfig from '@/state/simulate/categories/synaptome-simulation-config';

export default function useSynaptomeModel({
  virtualLabId,
  projectId,
}: {
  projectId: string;
  virtualLabId: string;
}) {
  const { id } = useResourceInfoFromPath();
  const settedRef = useRef(false);
  const bootstrapSimulationContext = useSetAtom(SynaptomeSimulationInstanceAtom);

  const { newConfig, state: currentSynapseConfig } = useSynaptomeSimulationConfig();
  const { resource: model } = useModel<SynaptomeModelResource>({
    modelId: id,
    org: virtualLabId,
    project: projectId,
  });

  const { configuration } = useModelConfiguration<SynaptomeConfigDistribution>({
    contentUrl: model?.distribution.contentUrl,
  });

  useEffect(() => {
    if (model && configuration && !settedRef.current) {
      bootstrapSimulationContext({ model, configuration });
      const cloningASimulation = currentSynapseConfig.length > 0;
      if (!cloningASimulation) {
        newConfig(configuration.synapses);
      }
      settedRef.current = true;
    }
  }, [configuration, model, currentSynapseConfig.length, newConfig, bootstrapSimulationContext]);

  return {
    model,
    configuration,
  };
}
