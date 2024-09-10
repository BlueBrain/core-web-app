import { ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { OnCellClick } from '../ExploreSectionListingView/ExploreSectionTable';
import { RenderButtonProps } from '../ExploreSectionListingView/useRowSelection';
import { detailUrlBuilder } from '@/util/common';
import { ExploreDataScope } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';
import { VirtualLabInfo } from '@/types/virtual-lab/common';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';

export default function ExploreMEModelTable({
  dataType,
  dataScope,
  virtualLabInfo,
  renderButton,
}: {
  dataType: DataType;
  dataScope: ExploreDataScope;
  virtualLabInfo?: VirtualLabInfo;
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
        dataType,
        dataScope,
        onCellClick,
        virtualLabInfo,
        renderButton,
      }}
    />
  );
}
