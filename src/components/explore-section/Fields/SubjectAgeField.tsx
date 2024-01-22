import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { subjectAgeDataFamily } from '@/state/explore-section/detail-view-atoms';
import { useLoadableValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

export default function SubjectAgeField() {
  const resourceInfo = useResourceInfoFromPath();
  const subjectAge = useLoadableValue(subjectAgeDataFamily(resourceInfo));

  if (subjectAge.state === 'loading') return <Spin indicator={<LoadingOutlined />} />;

  if (subjectAge.state === 'hasData') return subjectAge.data;
}
