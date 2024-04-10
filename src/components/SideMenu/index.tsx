import Link from 'next/link';
import { useReducer, useRef } from 'react';
import { Button } from 'antd';
import { HomeOutlined, PlusOutlined, MinusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { LinkItem } from '../VerticalLinks';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import { classNames } from '@/util/utils';
import { Role } from '@/constants/virtual-labs/sidemenu';

type Props = {
  links: LinkItem[];
  lab?: LinkItem;
};

export default function SideMenu({ links, lab }: Props) {
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

  const linkClassName = (link: LinkItem) => {
    let baseClass = `flex w-full items-center justify-between capitalize ${link.styles}`;
    if (expanded) baseClass += 'py-3 px-2 border border-primary-4';
    if ((link.role === Role.Section || link.role === Role.Current) && expanded)
      baseClass = 'hidden';
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
          'my-5 w-full font-semibold text-white',
          expanded ? 'mt-14 flex-row' : 'flex items-center gap-x-3.5',
          !expanded && 'rotate-180 transform cursor-e-resize [writing-mode:vertical-rl]'
        )}
        role="presentation"
      >
        {lab && expanded && (
          <div className="my-4 flex w-full flex-col items-start" key={lab.key}>
            {expanded && (
              <span className="text-lg font-thin uppercase text-primary-4">{lab.label}</span>
            )}
            <Link href={lab.href} className={linkClassName(lab)}>
              {lab.content}
              {expanded && <ArrowRightOutlined className="ml-2" />}
            </Link>
          </div>
        )}
        {links.map((link) => (
          <div
            className={classNames(
              'flex flex-col items-start',
              link.role === Role.Section ? 'w-2/3' : 'w-full'
            )}
            key={link.key}
          >
            {expanded && (
              <span className="text-lg font-thin uppercase text-primary-4">{link.label}</span>
            )}
            <Link href={link.href} className={linkClassName(link)}>
              {link.content}
              {expanded && <ArrowRightOutlined className="ml-2" />}
            </Link>
          </div>
        ))}
      </div>
      <Button
        type="text"
        onClick={toggleExpand}
        className={classNames('absolute top-1 z-20 order-2', expanded && 'right-1 top-5')}
        icon={
          expanded ? (
            <MinusOutlined className="text-sm text-white" />
          ) : (
            <PlusOutlined className="h-[14px] w-[14px] text-sm text-white" />
          )
        }
      />
      {lab && !expanded && (
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
