import { useEffect, useRef, ReactNode, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Modal, Select } from 'antd';
import { useAtom, useSetAtom } from 'jotai';

import { newProjectModalOpenAtom, virtualLabIdAtom } from '../state';
import { projectTopMenuRefAtom, virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';

import { useUnwrappedValue } from '@/hooks/hooks';

type Props = {
  extraItems?: ReactNode[];
};

export default function VirtualLabTopMenu({ extraItems }: Props) {
  const { data: session } = useSession();
  const localRef = useRef(null);
  const setProjectTopMenuRef = useSetAtom(projectTopMenuRefAtom);
  const [, setOpen] = useAtom(newProjectModalOpenAtom);
  const [virtualLabId, setVirtualLabId] = useAtom(virtualLabIdAtom);
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

          {extraItems}
        </div>
      </div>

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
    </>
  );
}
