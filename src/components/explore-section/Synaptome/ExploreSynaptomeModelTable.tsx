import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { OnCellClick } from '../ExploreSectionListingView/ExploreSectionTable';
import { RenderButtonProps } from '../ExploreSectionListingView/useRowSelection';
import { detailUrlBuilder } from '@/util/common';
import { ExploreDataScope } from '@/types/explore-section/application';
import { DataType } from '@/constants/explore-section/list-views';
import { VirtualLabInfo } from '@/types/virtual-lab/common';
import { getOrgAndProjectFromProjectId } from '@/util/nexus';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

import ExploreSectionListingView from '@/components/explore-section/ExploreSectionListingView';

export default function ExploreSynaptomeModelTable({
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

  const onCellClick: OnCellClick = (_basePath, record) => {
    const { org, project } = getOrgAndProjectFromProjectId(record._source.project['@id']);
    const vlProjectUrl = generateVlProjectUrl(org, project);
    const baseBuildUrl = `${vlProjectUrl}/explore/interactive/model/synaptome`;
    const exploreUrl = detailUrlBuilder(baseBuildUrl, record);

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
