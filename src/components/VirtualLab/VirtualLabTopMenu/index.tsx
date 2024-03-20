import { UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function VirtualLabTopMenu() {
  const { data: session } = useSession();

  return (
    <div className="flex h-14 w-full justify-end">
      <div className="flex w-fit justify-end border border-primary-7">
        <Link className="w-48 border-r border-primary-7 p-4 font-bold" href="/getting-started">
          Getting Started
        </Link>
        <Link className="w-48 border-r border-primary-7 p-4 font-bold" href="/about">
          About
        </Link>
        <div className="w-48 border-r border-primary-7 p-4 font-bold">
          <UserOutlined className="mr-2 text-primary-4" />
          <span className="font-bold">{session?.user.name}</span>
        </div>
      </div>
    </div>
  );
}
