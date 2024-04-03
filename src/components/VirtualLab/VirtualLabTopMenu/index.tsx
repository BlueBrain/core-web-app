import { UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function VirtualLabTopMenu() {
  const { data: session } = useSession();

  return (
    <div className="z-10 flex h-14 w-fit justify-end gap-2">
      <Link className="w-48 bg-primary-9 p-4  font-bold" href="/getting-started">
        Getting Started
      </Link>
      <Link className="w-48 bg-primary-9 p-4  font-bold" href="/about">
        About
      </Link>
      <Link className="w-48 bg-primary-9 p-4  font-bold" href={session?.user ? 'user' : 'login'}>
        {session?.user ? (
          <>
            <UserOutlined className="mr-2 text-primary-4" />
            <span className="font-bold">{session?.user.name}</span>
          </>
        ) : (
          <>Login</>
        )}
      </Link>
    </div>
  );
}
