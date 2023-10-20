import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import { speciesDataFamily } from '@/state/explore-section/detail-view-atoms';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function Species() {
  const resourceInfo = useResourceInfoFromPath();

  const speciesLabel = useAtomValue(
    useMemo(() => loadable(speciesDataFamily(resourceInfo)), [resourceInfo])
  );

  if (speciesLabel.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (speciesLabel && speciesLabel.state === 'hasData')
    return <span>{speciesLabel.data?.subject?.species?.label}</span>;

  return <>Not Found</>;
}
