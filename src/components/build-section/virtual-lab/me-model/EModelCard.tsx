import { useAtomValue } from 'jotai';
import { useParams } from 'next/navigation';
import { Empty } from 'antd';

import { selectedEModelAtom } from '@/state/virtual-lab/build/me-model';
import EModelTracePreview from '@/components/explore-section/ExploreSectionListingView/EModelTracePreview';
import { EModel } from '@/types/e-model';
import { detailUrlWithinLab } from '@/util/common';
import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import { BookmarkTabsName } from '@/types/virtual-lab/bookmark';
import ModelCard from '@/components/build-section/virtual-lab/me-model/ModelCard';

type Props = {
  reselectLink?: boolean;
};

export default function EModelCard({ reselectLink = false }: Props) {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const { virtualLabId, projectId } = useParams<{
    virtualLabId?: string;
    projectId?: string;
  }>();

  const generateDetailUrl = () => {
    if (!selectedEModel) return '';
    if (!virtualLabId || !projectId) return selectedEModel['@id'];

    const idParts = selectedEModel['@id'].split('/');
    const orgProj = `${idParts.at(-3)}/${idParts.at(-2)}`;
    return detailUrlWithinLab(
      virtualLabId,
      projectId,
      orgProj,
      selectedEModel['@id'],
      BookmarkTabsName.MODELS,
      ModelTypeNames.E_MODEL
    );
  };

  const details = [
    { label: 'Examplar morphology', value: undefined },
    { label: 'Optimization target', value: undefined },
    { label: 'Brain Region', value: selectedEModel?.brainLocation?.brainRegion?.label },
    { label: 'E-Type', value: selectedEModel?.eType },
  ];

  return (
    <ModelCard
      model={selectedEModel}
      modelType="E-Model"
      selectUrl="configure/e-model"
      generateDetailUrl={generateDetailUrl}
      modelDetails={details}
      thumbnail={selectedEModel && <EModelThumbnail emodel={selectedEModel} />}
      reselectLink={reselectLink}
    />
  );
}

export function EModelThumbnail({ emodel }: { emodel: EModel }) {
  if (!emodel.image)
    return <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return <EModelTracePreview images={emodel.image} height={200} width={200} />;
}
