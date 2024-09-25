import { useAtomValue } from 'jotai';
import { useParams } from 'next/navigation';

import { selectedMModelAtom } from '@/state/virtual-lab/build/me-model';
import { ExperimentTypeNames } from '@/constants/explore-section/data-types/experiment-data-types';
import { detailUrlWithinLab } from '@/util/common';
import { BookmarkTabsName } from '@/types/virtual-lab/bookmark';
import ModelCard from '@/components/build-section/virtual-lab/me-model/ModelCard';
import { mTypeSelectorFn } from '@/util/explore-section/selector-functions';

type Props = {
  reselectLink?: boolean;
};

export default function MorphologyCard({ reselectLink = false }: Props) {
  const selectedMModel = useAtomValue(selectedMModelAtom);
  const { virtualLabId, projectId } = useParams<{
    virtualLabId?: string;
    projectId?: string;
  }>();

  const generateDetailUrl = () => {
    if (!selectedMModel) return '';
    if (!virtualLabId || !projectId) return selectedMModel['@id'];

    const idParts = selectedMModel['@id'].split('/');
    const orgProj = `${idParts.at(-3)}/${idParts.at(-2)}`;
    return detailUrlWithinLab(
      virtualLabId,
      projectId,
      orgProj,
      selectedMModel['@id'],
      BookmarkTabsName.EXPERIMENTS,
      ExperimentTypeNames.MORPHOLOGY
    );
  };

  const details = [
    { label: 'Brain Region', value: selectedMModel?.brainLocation?.brainRegion?.label },
    { label: 'Species', value: selectedMModel?.subject?.species?.label },
    { label: 'License', value: selectedMModel?.license?.['@id'] },
    { label: 'M-Type', value: selectedMModel ? mTypeSelectorFn(selectedMModel) : undefined },
    { label: 'Age', value: undefined },
  ];

  return (
    <ModelCard
      model={selectedMModel}
      modelType="M-Model"
      selectUrl="configure/morphology"
      generateDetailUrl={generateDetailUrl}
      modelDetails={details}
      reselectLink={reselectLink}
    />
  );
}
