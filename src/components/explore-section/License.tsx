import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { licenseDataAtom } from '@/state/explore-section/detail-atoms-constructor';

const licenseDataLoadableAtom = loadable(licenseDataAtom);

export default function License() {
  const license = useAtomValue(licenseDataLoadableAtom);

  if (license.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (license.state === 'hasData') return <span>{license.data?.license?.name}</span>;

  return <>Not Found</>;
}
