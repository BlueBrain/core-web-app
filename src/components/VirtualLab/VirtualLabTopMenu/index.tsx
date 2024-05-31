import { useEffect, useRef, ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSetAtom } from 'jotai';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import { classNames } from '@/util/utils';

type Props = {
  className?: string;
  extraItems?: ReactNode[];
  ghost?: boolean;
};

export default function VirtualLabTopMenu({ className, extraItems, ghost = true }: Props) {
  const { data: session } = useSession();
  const localRef = useRef(null);
  const setProjectTopMenuRef = useSetAtom(projectTopMenuRefAtom);

  useEffect(() => {
    setProjectTopMenuRef(localRef);
  }, [localRef, setProjectTopMenuRef]);

  const btnClassName = classNames(
    'w-52 p-4 font-bold',
    ghost ? 'bg-transparent' : 'bg-primary-8 border border-primary-7'
  );

  return (
    <div className={classNames('flex h-14 w-full justify-between', className)}>
      <div className="flex gap-4" ref={localRef} />
      <div
        className={classNames(
          'flex w-fit items-center justify-end gap-1',
          ghost ? 'divide-x divide-primary-7 border border-primary-7' : ''
        )}
      >
        {[
          {
            children: 'Getting Started',
            href: '/getting-started',
            key: 'getting-started',
          },
          {
            children: 'About',
            href: '/about',
            key: 'about',
          },
        ].map(({ children, href, key }) => (
          <Link className={btnClassName} href={href} key={key}>
            {children}
          </Link>
        ))}
        {!!session && (
          <div className={classNames(btnClassName, 'flex flex-row justify-between')}>
            <span className="font-bold">{session?.user.name}</span>
            <UserOutlined className="mr-2 text-primary-4" />
          </div>
        )}
        {extraItems}
      </div>
    </div>
  );
}
