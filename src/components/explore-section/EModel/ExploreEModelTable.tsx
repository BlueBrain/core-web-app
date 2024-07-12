import { ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSetAtom } from 'jotai/react';

import { OnCellClick } from '../ExploreSectionListingView/ExploreSectionTable';
import { RenderButtonProps } from '../ExploreSectionListingView/useRowSelection';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { detailUrlBuilder } from '@/util/common';
import { ExploreDataScope } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';
import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { ESeModel } from '@/types/explore-section/es';
import { setInitializationValue } from '@/util/utils';
import { DEFAULT_E_MODEL_STORAGE_KEY } from '@/constants/cell-model-assignment/e-model';
import { EModelMenuItem } from '@/types/e-model';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

function buildEModelEntry(source: ESeModel): EModelMenuItem {
  return {
    name: source.name,
    id: source['@id'],
    eType: source.eType?.label ?? '',
    mType: source.mType?.label ?? '',
    isOptimizationConfig: false,
    brainRegion: source.brainRegion['@id'],
  } as EModelMenuItem;
}

export default function ExploreEModelTable({
  dataType,
  dataScope,
  renderButton,
  virtualLabInfo,
}: {
  dataType: DataType;
  dataScope: ExploreDataScope;
  virtualLabInfo?: VirtualLabInfo;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const { push: navigate } = useRouter();
  const params = useSearchParams();
  const setSelectedEModel = useSetAtom(selectedEModelAtom);
  const setEModelUIConfig = useSetAtom(eModelUIConfigAtom);
  const setEModelEditMode = useSetAtom(eModelEditModeAtom);

  const onCellClick: OnCellClick = (basePath, record) => {
    const source = record._source as ESeModel;
    const eModel = buildEModelEntry(source);
    const brainRegionId = source.brainRegion['@id'];
    const newSearhParams = new URLSearchParams(params);
    newSearhParams.set('eModelBrainRegion', brainRegionId);

    const exploreUrl = `${detailUrlBuilder(basePath, record)}?${newSearhParams.toString()}`;

    setSelectedEModel(eModel);
    setEModelUIConfig({});
    setEModelEditMode(false);
    setInitializationValue(DEFAULT_E_MODEL_STORAGE_KEY, {
      value: eModel,
      brainRegionId,
    });
    navigate(exploreUrl);
  };

  return (
    <ExploreSectionListingView
      {...{
        dataType,
        dataScope,
        onCellClick,
        renderButton,
        virtualLabInfo,
      }}
    />
  );
}
