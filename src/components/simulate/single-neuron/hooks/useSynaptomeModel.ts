import { useRef } from 'react';

import { useModel } from '@/hooks/useModel';
import { SynaptomeModelResource } from '@/types/explore-section/delta-model';
import { useModelConfiguration } from '@/hooks/useModelConfiguration';
import { SynaptomeConfigDistribution } from '@/types/synaptome';

export default function useSynaptomeModel({
  virtualLabId,
  projectId,
  modelId,
  callback,
}: {
  projectId: string;
  virtualLabId: string;
  modelId: string | null;
  callback?: (model: SynaptomeModelResource, config: SynaptomeConfigDistribution) => void;
}) {
  const dataSetted = useRef(false);

  const { resource: model } = useModel<SynaptomeModelResource>({
    modelId,
    org: virtualLabId,
    project: projectId,
  });

  const { configuration } = useModelConfiguration<SynaptomeConfigDistribution>({
    contentUrl: model?.distribution?.contentUrl,
  });

  if (model && configuration && !dataSetted.current) {
    callback?.(model, configuration);
    dataSetted.current = true;
  }

  return {
    model,
    configuration,
  };
}
