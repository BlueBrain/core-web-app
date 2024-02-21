import { ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSetAtom } from 'jotai/react';

import { OnCellClick } from '../ExploreSectionListingView/ExploreSectionTable';
import { RenderButtonProps } from '../ExploreSectionListingView/WithRowSelection';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { detailUrlBuilder } from '@/util/common';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
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

export default function WithExploreEModel({
  enableDownload,
  dataType,
  brainRegionSource,
  renderButton,
}: {
  enableDownload?: boolean;
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const { push: navigate } = useRouter();
  const params = useSearchParams();
  const setSelectedEModel = useSetAtom(selectedEModelAtom);
  const setEModelUIConfig = useSetAtom(eModelUIConfigAtom);
  const setEModelEditMode = useSetAtom(eModelEditModeAtom);

  const onCellClick: OnCellClick = (basePath, record, type) => {
    const source = record._source as ESeModel;
    const eModel = buildEModelEntry(source);
    const brainRegionId = source.brainRegion['@id'];
    const newSearhParams = new URLSearchParams(params);
    newSearhParams.set('eModelBrainRegion', brainRegionId);

    const exploreUrl = `${detailUrlBuilder(basePath, record, type)}?${newSearhParams.toString()}`;

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
        enableDownload,
        dataType,
        brainRegionSource,
        onCellClick,
        renderButton,
      }}
    />
  );
}
