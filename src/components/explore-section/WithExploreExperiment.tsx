import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { RenderButtonProps } from './ExploreSectionListingView/WithRowSelection';
import { OnCellClick } from './ExploreSectionListingView/ExploreSectionTable';
import { detailUrlBuilder } from '@/util/common';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';

export default function WithExploreExperiment({
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
  const router = useRouter();
  const onCellClick: OnCellClick = (basePath, record) => {
    router.push(detailUrlBuilder(basePath, record));
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
