import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useCallback } from 'react';

import useNotification from '@/hooks/notifications';
import { userProjectsTotalAtom } from '@/state/virtual-lab/projects';
import { userVirtualLabTotalsAtom } from '@/state/virtual-lab/lab';

export default function DashboardTotals() {
  const projectTotals = useAtomValue(loadable(userProjectsTotalAtom));
  const virtualLabTotals = useAtomValue(loadable(userVirtualLabTotalsAtom));
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

  const renderVirtualLabTotals = useCallback(() => {
    if (virtualLabTotals.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (virtualLabTotals.state === 'hasData') {
      return virtualLabTotals.data;
    }
    notify.error('Something went wrong when fetching project totals');
    return null;
  }, [notify, virtualLabTotals]);

  return (
    <div className="flex flex-col">
      <div>Total labs: {renderVirtualLabTotals()}</div>
      <div>Total projects: {renderProjectTotals()}</div>
    </div>
  );
}
