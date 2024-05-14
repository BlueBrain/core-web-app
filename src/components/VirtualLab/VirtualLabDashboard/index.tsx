'use client';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Spin, Switch } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { useCallback, useState } from 'react';

import { CreateVirtualLabButton } from '../VirtualLabTopMenu/CreateVirtualLabButton';
import { NewProjectModal } from '../projects/VirtualLabProjectList';
import VirtualLabAndProject from './VirtualLabAndProject';
import DashboardTotals from './DashboardTotals';
import {
  newProjectModalOpenAtom,
  virtualLabIdAtom,
  virtualLabsOfUserAtom,
} from '@/state/virtual-lab/lab';

import useNotification from '@/hooks/notifications';
import { Project } from '@/types/virtual-lab/projects';

function VirtualLabDashboard() {
  const virtualLabs = useAtomValue(loadable(virtualLabsOfUserAtom));
  const [showOnlyLabs, setShowOnlyLabs] = useState<boolean>(false);
  const [, setOpen] = useAtom(newProjectModalOpenAtom);
  const [virtualLabId, setVirtualLabId] = useAtom(virtualLabIdAtom);
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const notification = useNotification();

  const renderVirtualLabs = useCallback(() => {
    if (virtualLabs.state === 'loading') {
      return <Spin indicator={<LoadingOutlined />} />;
    }
    if (virtualLabs.state === 'hasData') {
      return virtualLabs.data?.results.map((vl) => (
        <VirtualLabAndProject
          key={vl.id}
          id={vl.id}
          name={vl.name}
          description={vl.description}
          createdAt={vl.created_at}
          showOnlyLabs={showOnlyLabs}
        />
      ));
    }
    return null;
  }, [virtualLabs, showOnlyLabs]);

  return (
    <>
      <div className="inset-0 z-0 grid grid-cols-[1fr_4fr] grid-rows-1 bg-primary-9 text-white">
        <div className="mt-[25%] flex gap-3">
          <div>Show only virtual labs</div>
          <Switch
            value={showOnlyLabs}
            onChange={(value) => {
              setShowOnlyLabs(value);
            }}
          />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <div className="text-5xl font-bold uppercase">Your virtual labs and projects</div>
            <DashboardTotals />
          </div>
          {renderVirtualLabs()}
          <div className="fixed bottom-5 right-7">
            <Button
              className="mr-5 h-12 w-52 rounded-none border-none text-sm font-bold"
              onClick={() => setIsProjectModalVisible(true)}
            >
              <span className="relative text-primary-8">
                Create Project <PlusOutlined className="relative left-3" />
              </span>
            </Button>
            <CreateVirtualLabButton />
          </div>
        </div>
      </div>

      {virtualLabs.state === 'hasData' && virtualLabs.data && (
        <>
          <Modal
            title={null}
            open={isProjectModalVisible}
            footer={
              <div>
                <Button key="back" onClick={() => setIsProjectModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => {
                    setIsProjectModalVisible(false);
                    setVirtualLabId(virtualLabId);
                    setOpen(true);
                  }}
                  disabled={!virtualLabId}
                >
                  OK
                </Button>
              </div>
            }
            width={500}
            onCancel={() => setIsProjectModalVisible(false)}
          >
            <span className="my-3 block font-bold text-primary-8">Project Location</span>
            <Select
              style={{ width: 200 }}
              options={[
                { label: '-', value: '' },
                ...virtualLabs.data.results.map((vl) => ({ label: vl.name, value: vl.id })),
              ]}
              onChange={(v) => setVirtualLabId(v)}
            />
          </Modal>
          <NewProjectModal
            onFail={(error: string) => notification.error(`Project creation failed: ${error}`)}
            onSuccess={(newProject: Project) => {
              notification.success(`${newProject.name} has been created.`);
            }}
            virtualLabId={virtualLabId}
          />
        </>
      )}
    </>
  );
}

export default function VirtualLabDashboardWithModalState() {
  return <VirtualLabDashboard />;
}
