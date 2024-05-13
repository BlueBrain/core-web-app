import { useEffect, useRef, ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSetAtom } from 'jotai';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';

type Props = {
  extraItems?: ReactNode[];
};

export default function VirtualLabTopMenu({ extraItems }: Props) {
  const { data: session } = useSession();
  const localRef = useRef(null);
  const setProjectTopMenuRef = useSetAtom(projectTopMenuRefAtom);
  useEffect(() => {
    setProjectTopMenuRef(localRef);
  }, [localRef, setProjectTopMenuRef]);

  return (
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
  );
}
