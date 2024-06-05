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
  const { error } = useNotification();

  const renderTotals = (totals: Loadable<Promise<number | undefined>>, errorMessage: string) => {
    if (totals.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (totals.state === 'hasData') {
      return totals.data;
    }
    if (totals.state === 'hasError') {
      error(errorMessage, 5, 'topRight', true, 'render-total-error-message');
    }

    return null;
  };

  return (
    <div className="flex flex-row gap-7">
      <div>
        Total labs:&nbsp;
        {renderTotals(virtualLabTotals, 'Something went wrong when fetching lab totals')}
      </div>
      <div>
        Total projects:&nbsp;
        {renderTotals(projectTotals, 'Something went wrong when fetching project totals')}
      </div>
    </div>
  );
}
