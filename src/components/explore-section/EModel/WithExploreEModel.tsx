import { ReactNode, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai/react';
import find from 'lodash/find';

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
import {
  brainRegionHierarchyStateAtom,
  brainRegionsAtom,
  selectedBrainRegionAtom,
} from '@/state/brain-regions';
import { EModelMenuItem } from '@/types/e-model';
import { generateHierarchyPathTree, getAncestors } from '@/components/BrainTree/util';

function buildEModelEntry(source: ESeModel): EModelMenuItem {
  return {
    name: source.name,
    id: source['@id'],
    eType: source.eType?.label ?? '',
    mType: source.mType?.label ?? '',
    isOptimizationConfig: false,
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
  const setSelectedEModel = useSetAtom(selectedEModelAtom);
  const setEModelUIConfig = useSetAtom(eModelUIConfigAtom);
  const setEModelEditMode = useSetAtom(eModelEditModeAtom);
  const brainRegions = useAtomValue(brainRegionsAtom);
  const setSelectedBrainRegion = useSetAtom(selectedBrainRegionAtom);
  const setBrainRegionHierarchyState = useSetAtom(brainRegionHierarchyStateAtom);
  const [, startTransition] = useTransition();

  const onCellClick: OnCellClick = (basePath, record, type) => {
    const source = record._source as ESeModel;
    const eModel = buildEModelEntry(source);
    const brainRegionId = source.brainRegion['@id'];
    const brainRegion = find(brainRegions, ['id', brainRegionId]);
    const buildUrl = `${detailUrlBuilder(basePath, record, type)}?brainRegion=${encodeURIComponent(
      brainRegionId
    )}`;
    const allAncestors = getAncestors(brainRegions ?? [], brainRegionId);
    const newHierarchyTree = generateHierarchyPathTree(
      allAncestors.map((entry) => Object.keys(entry)[0])
    );

    setSelectedEModel(eModel);
    setEModelUIConfig({});
    setEModelEditMode(false);
    setInitializationValue(DEFAULT_E_MODEL_STORAGE_KEY, {
      value: eModel,
      brainRegionId,
    });
    startTransition(() => {
      setBrainRegionHierarchyState(newHierarchyTree);
      setSelectedBrainRegion({
        id: brainRegionId,
        leaves: brainRegion?.leaves || null,
        title: brainRegion?.title ?? '',
      });
    });
    navigate(buildUrl);
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
