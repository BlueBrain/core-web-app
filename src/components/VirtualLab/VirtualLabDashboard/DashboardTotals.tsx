import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useCallback } from 'react';

import useNotification from '@/hooks/notifications';
import { userProjectsTotalAtom } from '@/state/virtual-lab/projects';

export default function DashboardTotals() {
  const projectTotals = useAtomValue(loadable(userProjectsTotalAtom));
  const notify = useNotification();

  const renderProjectTotals = useCallback(() => {
    if (projectTotals.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (projectTotals.state === 'hasData') {
      return projectTotals.data;
    }
    notify.error('Something went wrong when fetching project totals');
    return null;
  }, [notify, projectTotals]);

  return (
    <div className="flex flex-col">
      <div>Total labs: N/A</div>
      <div>Total projects: {renderProjectTotals()}</div>
    </div>
  );
}
