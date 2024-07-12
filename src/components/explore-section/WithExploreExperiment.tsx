import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { RenderButtonProps } from './ExploreSectionListingView/useRowSelection';
import { OnCellClick } from './ExploreSectionListingView/ExploreSectionTable';
import { detailUrlBuilder } from '@/util/common';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';

export default function WithExploreExperiment({
  dataType,
  brainRegionSource,
  renderButton,
}: {
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const router = useRouter();
  const onCellClick: OnCellClick = (basePath, record) => {
    router.push(detailUrlBuilder(basePath, record));
  };

  return (
    <ExploreSectionListingView
      {...{
        dataType,
        brainRegionSource,
        onCellClick,
        renderButton,
      }}
    />
  );
}
