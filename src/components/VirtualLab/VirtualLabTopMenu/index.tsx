'use client';

import React, { useEffect, useRef, ReactNode, useState, useLayoutEffect } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSetAtom } from 'jotai';
import { projectTopMenuRefAtom } from '@/state/virtual-lab/lab';
import { classNames } from '@/util/utils';
import { basePath } from '@/config';

type Props = {
  className?: string;
  extraItems?: ReactNode[];
  ghost?: boolean;
};

function VirtualLabTopMenu({ className, extraItems, ghost = true }: Props) {
  const { data: session } = useSession();
  const localRef = useRef(null);
  const setProjectTopMenuRef = useSetAtom(projectTopMenuRefAtom);
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuElementsHeight, setMenuElementsHeight] = useState<number>();

  /* Measure height of "User" menu element (menuRef), to
     determine menu height. layoutEffect to prevent menu 
     from painting before the height has been determined. 
  */
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

  const renderMenuLink = (text: string, href: string) => (
    <Link
      className={classNames(getMenuButtonClassName(ghost), 'border border-primary-7')}
      href={href}
      style={{ height: menuElementsHeight }}
    >
      {text}
    </Link>
  );

  return (
    <div
      className={classNames('flex w-full justify-between overflow-y-visible', className)}
      style={{ height: menuElementsHeight }}
    >
      <div className="flex gap-4" ref={localRef} />

      <div className={classNames('flex w-fit justify-end')}>
        {renderMenuLink('Getting Started', '/getting-started')}
        {renderMenuLink('About', '/about')}

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
              style={{
                padding: '13px',
                transitionDuration: '1000ms',
              }}
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
                onClick={() => signOut({ callbackUrl: `${basePath}/log-in` })}
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

/* 
  Since menu height is determined dynamically on mount,
  pre-rendering will show disparate heights for each of 
  the menu elements. Disabling SSR prevents that.
 */
export default dynamic(() => Promise.resolve(VirtualLabTopMenu), {
  ssr: false,
  /* Empty space where the Menu will mount to prevent the elements from 'shifting down' once 
  the menu loads */
  loading: () => <div style={{ height: 49 }} />,
});
