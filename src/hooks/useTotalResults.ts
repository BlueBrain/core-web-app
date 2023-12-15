'use client';

import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { totalAtom } from '@/state/explore-section/list-view-atoms';
import { formatNumber } from '@/util/common';

type Props = ({
  experimentTypeName,
  brainRegionSource,
}: {
  experimentTypeName: string;
  brainRegionSource: ExploreDataBrainRegionSource;
}) => string;

const useTotalResults: Props = ({ experimentTypeName, brainRegionSource }) => {
  const total = useAtomValue(unwrap(totalAtom({ experimentTypeName, brainRegionSource })));

  return total ? `(${formatNumber(total)})` : '';
};

export default useTotalResults;
