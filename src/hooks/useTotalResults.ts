'use client';

import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { totalAtom } from '@/state/explore-section/list-view-atoms';
import { formatNumber } from '@/util/common';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreDataScope } from '@/types/explore-section/application';

type Props = ({
  dataType,
  dataScope,
}: {
  dataType: DataType;
  dataScope: ExploreDataScope;
}) => string;

const useTotalResults: Props = ({ dataType, dataScope }) => {
  const total = useAtomValue(unwrap(totalAtom({ dataType, dataScope })));

  return total ? `(${formatNumber(total)})` : '';
};

export default useTotalResults;
