import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useMemo } from 'react';
import { licenseDataFamily } from '@/state/explore-section/detail-view-atoms';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function License() {
  const resourceInfo = useResourceInfoFromPath();

  const license = useAtomValue(
    useMemo(() => loadable(licenseDataFamily(resourceInfo)), [resourceInfo])
  );

  if (license.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (license.state === 'hasData') return <span>{license.data}</span>;

  return <>Not Found</>;
}
