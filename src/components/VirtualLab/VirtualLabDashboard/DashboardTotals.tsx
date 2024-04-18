import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Loadable } from 'jotai/vanilla/utils/loadable';

import useNotification from '@/hooks/notifications';
import { userProjectsTotalAtom } from '@/state/virtual-lab/projects';
import { userVirtualLabTotalsAtom } from '@/state/virtual-lab/lab';

export default function DashboardTotals() {
  const projectTotals = useAtomValue(loadable(userProjectsTotalAtom));
  const virtualLabTotals = useAtomValue(loadable(userVirtualLabTotalsAtom));
  const notify = useNotification();

  const renderTotals = (totals: Loadable<Promise<number>>, errorMessage: string) => {
    if (totals.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (totals.state === 'hasData') {
      return totals.data;
    }
    notify.error(errorMessage);
    return null;
  };

  return (
    <div className="flex flex-col">
      <div>
        Total labs:
        {renderTotals(virtualLabTotals, 'Something went wrong when fetching lab totals')}
      </div>
      <div>
        Total projects:
        {renderTotals(projectTotals, 'Something went wrong when fetching project totals')}
      </div>
    </div>
  );
}
