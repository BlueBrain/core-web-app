import { useUnwrappedValue } from '@/hooks/hooks';
import { ModelResourceInfo, eModelConfigurationFamily } from '@/state/me-model';

import EModelCard from '@/components/build-section/virtual-lab/me-model/EModelCard';
import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';

import { from64 } from '@/util/common';

export default function Configuration({
  params,
}: {
  params: Omit<ModelResourceInfo, 'modelId'> & { id: string };
}) {
  const { modelType, virtualLabId, projectId, id: labProjectMeModelCombo } = params;

  const [, meModelIdWithWeirdThingOnEnd] = from64(labProjectMeModelCombo).split('!/!');

  const [meModelId] = meModelIdWithWeirdThingOnEnd.split('\rÃÜ'); // This appears as ==? in the URL

  const eModelConfiguration = useUnwrappedValue(
    eModelConfigurationFamily({
      meModelId,
      modelType,
      projectId,
      virtualLabId,
    })
  );

  const exemplarMorphology = eModelConfiguration?.uses.find(
    ({ '@type': type }) => type === 'NeuronMorphology'
  )?.name;

  return (
    <div className="flex w-full flex-col gap-4">
      <MorphologyCard />
      <EModelCard exemplarMorphology={exemplarMorphology} />
    </div>
  );
}
