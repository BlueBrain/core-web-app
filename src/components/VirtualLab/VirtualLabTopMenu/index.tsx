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
    'flex items-center h-full w-52 p-4 font-bold',
    ghost ? 'bg-transparent' : 'bg-primary-8 border border-primary-7'
  );

  return (
    <div className={classNames('flex w-full justify-between gap-6', className)}>
      <div className="contents" ref={localRef} />
      <div
        className={classNames(
          'ml-auto flex w-fit gap-1',
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
          <div className={btnClassName} key={key}>
            <Link href={href}>{children}</Link>
          </div>
        ))}
        {!!session && (
          <div className={classNames(btnClassName, 'flex-row justify-between')}>
            <span className="font-bold">{session?.user.name}</span>
            <UserOutlined className="mr-2 text-primary-4" />
          </div>
        )}
        {extraItems}
      </div>
    </div>
  );
}
