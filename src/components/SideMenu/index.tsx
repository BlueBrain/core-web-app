import Link from 'next/link';
import { useReducer, useRef } from 'react';
import { Button } from 'antd';
import { HomeOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { LinkItem } from '../VerticalLinks';
import {ApplicationSidebarHeader, ApplicationSidebarWrapper} from '@/components/ApplicationSidebar';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import { classNames } from '@/util/utils';

type Props = {
  links: LinkItem[];
  current?: string;
  lab?: LinkItem;
};

function MainSidebarHeader({ expanded }: { expanded: boolean }) {
  return expanded ? <span>OBP</span> : <span>Menu</span>;
}

export function VlabLinks({ children }: any) {
  const [expanded, toggleExpand] = useReducer((val: boolean) => !val, false);
  return (
    <div
      className={classNames(
        'relative my-1 flex w-full items-center',
        !expanded ? 'flex-col items-start gap-2' : 'justify-between flex-col'
      )}
    >
      <div
        className={classNames(
          'order-1 text-2xl font-bold',
          !expanded &&
            'relative top-10 order-2 -scale-100 transform text-lg [writing-mode:vertical-lr]'
        )}
      >
        {children}
      </div>
      <Button
        type="text"
        onClick={toggleExpand}
        className={classNames(
          'z-20 order-2 border-none bg-transparent',
          !expanded && 'absolute top-0 order-1'
        )}
        icon={
          expanded ? (
            <MinusOutlined className="text-sm text-white" />
          ) : (
            <PlusOutlined className="h-[14px] w-[14px] text-sm text-white" />
          )
        }
      />
    </div>
  );
}


export function VlabSidebar({ links, current, lab }: Props) {
  console.log("VlabSidebar links", links, "current", current, "lab", lab);
  return (
    <ApplicationSidebarWrapper>
        <VlabLinks>
          {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={
              current === link.key
                ? `rounded-full bg-primary-5 p-2 capitalize text-primary-9`
                : 'capitalize'
            }
          >
            {link.content}
          </Link>
        ))}
      </VlabLinks>
    </ApplicationSidebarWrapper>
  );
};

export default function SideMenu({ links, current, lab }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, toggleExpand] = useReducer((val: boolean) => !val, false);
  const title = MainSidebarHeader;

  useOnClickOutside(
    ref,
    () => {
      if (expanded) toggleExpand();
    },
    ['mousedown', 'touchstart'],
    (event) => {
      return event && (event.target as HTMLElement)?.closest('.ant-modal-root');
    }
  );

  return (
    <div className="flex h-full w-[40px] flex-col items-center justify-between border-r border-primary-7 px-7 py-2 text-lg font-semibold">
      <ApplicationSidebarHeader {...{ title, expanded, toggleExpand }} />
      <div
        className="my-5 flex items-center gap-x-3.5 text-white"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
      >
        {links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={
              current === link.key
                ? `rounded-full bg-primary-5 p-2 capitalize text-primary-9`
                : 'capitalize'
            }
          >
            {link.content}
          </Link>
        ))}
      </div>
      {lab && (
        <div className="text-primary-3">
          <Link
            key={lab.key}
            href={lab.href}
            className="capitalize"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              cursor: 'e-resize',
            }}
          >
            {lab.content}
          </Link>
          <Link href={lab.href} className="pl-[6px]">
            <HomeOutlined />
          </Link>
        </div>
      )}
    </div>
  );
}
