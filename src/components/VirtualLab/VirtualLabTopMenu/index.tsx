import { useEffect, useRef, ReactNode, useState } from 'react';
import { PlusOutlined, SettingTwoTone, UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Modal, Select } from 'antd';
import { atom, useAtom, useSetAtom } from 'jotai';
import { projectTopMenuRefAtom, virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';
import { useModalState } from '@/components/VirtualLab/create/contexts/ModalStateContext';

import { VirtualLabCreateInformation, VirtualLabCreatePlan } from '@/components/VirtualLab/create';
import { useUnwrappedValue } from '@/hooks/hooks';
import { NewProjectModal } from '../projects/VirtualLabProjectList';

type Props = {
  extraItems?: ReactNode[];
};

export const newProjectModalOpenAtom = atom(false);
export const virtualLabIdAtom = atom('');

export default function VirtualLabTopMenu({ extraItems }: Props) {
  const { data: session } = useSession();
  const localRef = useRef(null);
  const setProjectTopMenuRef = useSetAtom(projectTopMenuRefAtom);
  const [, setOpen] = useAtom(newProjectModalOpenAtom);
  const [virtualLabId, setVirtualLabId] = useAtom(virtualLabIdAtom);

  const { isModalVisible, currentStep, handleOk, handleCancel } = useModalState();
  const [isProjectModalVisible, setIsProjectModalVisible] = useState(false);
  const virtualLabs = useUnwrappedValue(virtualLabsOfUserAtom);

  useEffect(() => {
    setProjectTopMenuRef(localRef);
  }, [localRef, setProjectTopMenuRef]);

  return (
    <>
      <div className="flex h-14 w-full justify-between">
        <div className="flex gap-4" ref={localRef} />
        <div className="flex w-fit items-center justify-end border border-primary-7">
          <Link className="w-52 border-x border-primary-7 p-4 font-bold" href="/getting-started">
            Getting Started
          </Link>
          <Link className="w-52 border-r border-primary-7 p-4 font-bold" href="/about">
            About
          </Link>
          <div className="flex w-52 flex-row justify-between border-r border-primary-7 p-4 font-bold">
            <span className="font-bold">{session?.user.name}</span>
            <UserOutlined className="mr-2 text-primary-4" />
          </div>

          <div className="z-1 fixed font-bold text-primary-8" style={{ bottom: 20, right: 20 }}>
            <Button
              disabled={!virtualLabs || virtualLabs.results.length === 0}
              className="mr-2 w-52 border-none font-bold text-primary-8"
              style={{ borderRadius: 0, fontSize: 12, height: 40 }}
              onClick={() => setIsProjectModalVisible(true)}
            >
              Create Project
              <PlusOutlined className="relative bottom-1 left-3" />
            </Button>
            {extraItems}
          </div>
        </div>
      </div>
      <Modal
        title={null}
        open={isModalVisible}
        width={800}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {currentStep === 'information' && <VirtualLabCreateInformation />}
        {currentStep === 'plan' && <VirtualLabCreatePlan />}
      </Modal>
      <Modal
        title={null}
        open={isProjectModalVisible}
        onCancel={() => setIsProjectModalVisible(false)}
        onOk={() => {
          setIsProjectModalVisible(false);
          setOpen(true);
        }}
        width={500}
        closable
      >
        <span className="my-3 block font-bold text-primary-8">Project Location</span>
        <Select
          style={{ width: 200 }}
          options={
            virtualLabs && [
              { label: '-', value: '' },
              ...virtualLabs.results.map((vl) => ({ label: vl.name, value: vl.id })),
            ]
          }
          onChange={(v) => setVirtualLabId(v)}
        />
      </Modal>
      <NewProjectModal virtualLabId={virtualLabId} onSuccess={() => {}} onFail={() => {}} />
    </>
  );
}
