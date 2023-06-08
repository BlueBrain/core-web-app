import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { speciesDataAtom } from '@/state/explore-section/detail-atoms-constructor';

const speciesLabelLoadableAtom = loadable(speciesDataAtom);

export default function Species() {
  const speciesLabel = useAtomValue(speciesLabelLoadableAtom);

  if (speciesLabel.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (speciesLabel && speciesLabel.state === 'hasData')
    return <span>{speciesLabel.data?.subject?.species?.label}</span>;

  return <>Not Found</>;
}
