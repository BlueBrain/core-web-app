import { useEffect, useRef, ReactNode, useState, useLayoutEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSetAtom } from 'jotai';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import { classNames, signOut } from '@/util/utils';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuElementsHeight, setMenuElementsHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!menuRef || !menuRef.current) return;
    setMenuElementsHeight(menuRef.current.getBoundingClientRect().height);
  }, [setMenuElementsHeight]);

  useEffect(() => {
    setProjectTopMenuRef(localRef);
  }, [setProjectTopMenuRef]);

  const getMenuButtonClassName = (
    ghost: boolean // eslint-disable-line
  ) =>
    classNames(
      'w-52 p-4 font-bold flex items-center',
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
            className={classNames(getMenuButtonClassName(ghost), 'border border-primary-7')}
            href={href}
            key={key}
            style={{ height: menuElementsHeight ?? undefined }}
          >
            {children}
          </Link>
        ))}
        {!!session && (
          <div
            className="hover:z-20"
            onMouseLeave={() => {
              if (!expanded) return;
              setExpanded(false);
            }}
          >
            <div
              className={classNames(
                getMenuButtonClassName(expanded ? false : ghost),
                'flex cursor-pointer flex-row  justify-between border border-primary-7 transition-all ease-in-out'
              )}
              style={{ padding: '13px', transitionDuration: '1000ms' }}
              onMouseEnter={() => {
                if (expanded) return;
                setExpanded(true);
              }}
              ref={menuRef}
            >
              <span className="font-bold">{session?.user.name}</span>
              <UserOutlined className="mr-2 text-primary-4" />
            </div>

            <div
              className="relative transition-all ease-in-out"
              style={{ opacity: Number(expanded), transitionDuration: '1000ms' }}
            >
              <div
                className={classNames(
                  getMenuButtonClassName(false),
                  'flex flex-row justify-between  border border-t-0 border-primary-7'
                )}
              >
                <span className="font-bold">Account</span>
              </div>
              <button
                type="button"
                className={classNames(
                  getMenuButtonClassName(false),
                  'flex flex-row justify-between  border border-t-0 border-primary-7'
                )}
                onClick={signOut}
              >
                <span className="font-bold">Log out</span>
              </button>
            </div>
          </div>
        )}

        {extraItems}
      </div>
    </div>
  );
}
