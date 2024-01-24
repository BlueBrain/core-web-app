'use client';

import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { ExploreDataBrainRegionSource } from '@/types/explore-section/application';
import { totalAtom } from '@/state/explore-section/list-view-atoms';
import { formatNumber } from '@/util/common';
import { DataType } from '@/constants/explore-section/list-views';

type Props = ({
  dataType,
  brainRegionSource,
}: {
  dataType: DataType;
  brainRegionSource: ExploreDataBrainRegionSource;
}) => string;

const useTotalResults: Props = ({ dataType, brainRegionSource }) => {
  const total = useAtomValue(unwrap(totalAtom({ dataType, brainRegionSource })));

  return total ? `(${formatNumber(total)})` : '';
};

export default useTotalResults;
