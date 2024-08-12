import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { Settings } from './hide_for_sfn';

import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import useUpdateVirtualLab from '@/hooks/useUpdateVirtualLab';

export default function VirtualLabSettingsComponent({ id }: { id: string }) {
  const virtualLabDetail = useAtomValue(loadable(virtualLabDetailAtomFamily(id)));

  const updateVirtualLab = useUpdateVirtualLab(id);

  if (virtualLabDetail.state === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" indicator={<LoadingOutlined />} />
      </div>
    );
  }

  if (virtualLabDetail.state === 'hasError') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border p-8">
          {(virtualLabDetail.error as Error).message === 'Status: 404' ? (
            <>Virtual Lab not found</>
          ) : (
            <>Something went wrong when fetching virtual lab</>
          )}
        </div>
      </div>
    );
  }

  return <Settings updateVirtualLab={updateVirtualLab} virtualLabDetail={virtualLabDetail} />;
}
