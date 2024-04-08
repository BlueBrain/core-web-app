import Link from 'next/link';
import { useReducer, useRef } from 'react';
import { Button } from 'antd';
import { HomeOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { LinkItem } from '../VerticalLinks';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import { classNames } from '@/util/utils';

type Props = {
  links: LinkItem[];
  current?: string;
  lab?: LinkItem;
};

export default function SideMenu({ links, current, lab }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, toggleExpand] = useReducer((val: boolean) => !val, false);

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
      <Button
        type="text"
        onClick={toggleExpand}
        className={classNames('absolute top-0 z-20 order-2', !expanded && 'order-1')}
        icon={
          expanded ? (
            <MinusOutlined className="text-sm text-white" />
          ) : (
            <PlusOutlined className="h-[14px] w-[14px] text-sm text-white" />
          )
        }
      />
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
