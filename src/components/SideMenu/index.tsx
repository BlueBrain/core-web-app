import Link from 'next/link';
import { useReducer, useRef } from 'react';
import { Button } from 'antd';
import { HomeOutlined, PlusOutlined, MinusOutlined, ArrowRightOutlined } from '@ant-design/icons';
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

  const linkClassName = (linkKey: string) => {
    let baseClass = 'flex w-full items-center justify-between capitalize';
    if (expanded) baseClass += ' border border-white';
    if (current === linkKey && !expanded)
      baseClass += ' rounded-full bg-primary-5 px-[1px] py-4 text-primary-9';
    if (current === linkKey && expanded) baseClass = 'hidden';
    return baseClass;
  };

  return (
    <div
      ref={ref}
      className={classNames(
        'relative h-screen bg-primary-9 text-light transition-transform ease-in-out',
        expanded
          ? 'flex w-80 flex-col items-start justify-start px-5 shadow-[0px_5px_15px_rgba(0,0,0,.35)]'
          : 'flex w-10 flex-col items-center justify-between pt-6 transition-transform ease-in-out will-change-auto'
      )}
    >
      <div
        className={classNames(
          'my-5 w-full border border-green-400 font-semibold text-white',
          expanded ? 'flex-row' : 'flex items-center gap-x-3.5',
          !expanded && 'rotate-180 transform cursor-e-resize [writing-mode:vertical-rl]'
        )}
        role="presentation"
      >
        {links.map((link) => (
          <div className="flex w-full flex-col items-start border border-primary-5" key={link.key}>
            {expanded && <span className="mb-2 text-sm text-white">Label</span>}
            <Link href={link.href} className={linkClassName(link.key)}>
              {link.content}
              {expanded && <ArrowRightOutlined className="ml-2" />}
            </Link>
          </div>
        ))}
      </div>
      <Button
        type="text"
        onClick={toggleExpand}
        className={classNames('absolute top-1 z-20 order-2', !expanded && 'order-1')}
        icon={
          expanded ? (
            <MinusOutlined className="text-sm text-white" />
          ) : (
            <PlusOutlined className="h-[14px] w-[14px] text-sm text-white" />
          )
        }
      />
      {lab && (
        <div className="absolute bottom-0 z-20 mb-4 mt-auto flex w-[calc(100%-2.5rem)] flex-col items-center justify-center bg-primary-9 text-primary-3">
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
