import { useEffect, useRef, ReactNode, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useSession, signOut } from 'next-auth/react';
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
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setProjectTopMenuRef(localRef);
  }, [localRef, setProjectTopMenuRef]);

  const btnClassName = classNames(
    'w-52 p-4 font-bold',
    ghost ? 'bg-transparent' : 'bg-primary-8 border border-primary-7'
  );

  return (
    <div className={classNames('flex h-14 w-full justify-between overflow-y-visible', className)}>
      <div className="flex gap-4" ref={localRef} />
      <div className={classNames('flex w-fit justify-end')}>
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
          <Link
            className={classNames(btnClassName, 'border border-primary-7')}
            href={href}
            key={key}
          >
            {children}
          </Link>
        ))}
        {!!session && <div
          onMouseLeave={() => {
            if (!expanded) return;
            setExpanded(false);
          }}
        >
          <div
            className={classNames(
              btnClassName,
              'flex flex-row justify-between  border border-primary-7'
            )}
            style={{ padding: '13px' }}
            onMouseEnter={() => {
              if (expanded) return;
              setExpanded(true);
            }}
          >
            <span className="font-bold">{session?.user.name}</span>
            <UserOutlined className="mr-2 text-primary-4" />
          </div>
          {expanded && (
            <>
              <div
                className={classNames(
                  btnClassName,
                  'flex flex-row justify-between  border border-t-0 border-primary-7'
                )}
              >
                <span className="font-bold">Account</span>
              </div>
              <button
                type="button"
                className={classNames(
                  btnClassName,
                  'flex flex-row justify-between  border border-t-0 border-primary-7'
                )}
                onClick={() => {
                  signOut();
                  window.location.href = '/';
                }}
              >
                <span className="font-bold">Log out</span>
              </button>
            </>
          )}
        </div>}

        {extraItems}
      </div>
    </div>
  );
}
