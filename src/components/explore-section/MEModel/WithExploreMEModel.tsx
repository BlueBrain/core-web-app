import { ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { OnCellClick } from '../ExploreSectionListingView/ExploreSectionTable';
import { RenderButtonProps } from '../ExploreSectionListingView/WithRowSelection';
import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';
import { detailUrlBuilder } from '@/util/common';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';

export default function WithExploreMEModel({
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

  const onCellClick: OnCellClick = (basePath, record) => {
    const newSearhParams = new URLSearchParams(params);
    const exploreUrl = `${detailUrlBuilder(basePath, record)}?${newSearhParams.toString()}`;

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
