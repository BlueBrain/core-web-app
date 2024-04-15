import { useReducer, useRef } from 'react';
import { Button, Divider } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { LinkItem, LabItem } from '../VerticalLinks';
import LinkComponent from './LinkComponent';
import SideMenuBottom from './SideMenuBottom';
import LabsAndProjectsCollapse from './LabsAndProjectsCollapse';
import { classNames } from '@/util/utils';
import { Role } from '@/constants/virtual-labs/sidemenu';

type Props = {
  links: LinkItem[];
  lab: LabItem;
};

export default function SideMenu({ links, lab }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, toggleExpand] = useReducer((val: boolean) => !val, false);

  const linkClassName = (link: LinkItem) => {
    let baseClass = `flex w-full items-center justify-between capitalize ${link.styles}`;
    if (expanded) baseClass += ' py-3 px-2 border border-primary-6 text-lg';
    if ((link.role === Role.Section || link.role === Role.Current) && expanded)
      baseClass = 'hidden';
    return baseClass;
  };

  return (
    <div
      ref={ref}
      className={classNames(
        'relative flex h-screen flex-col bg-primary-9 text-light transition-transform ease-in-out',
        expanded
          ? 'w-80 items-start justify-start px-5 shadow-[0px_5px_15px_rgba(0,0,0,.35)]'
          : 'w-10 items-center justify-between pt-6 will-change-auto'
      )}
    >
      <div
        className={classNames(
          'my-6 w-full font-semibold text-white',
          expanded ? 'mt-12 flex-row' : 'flex items-center gap-x-3.5',
          !expanded && 'rotate-180 transform cursor-e-resize [writing-mode:vertical-rl]'
        )}
        role="presentation"
      >
        {expanded && <LinkComponent link={lab} expanded={expanded} linkClassName={linkClassName} />}
        {links.map((link) => (
          <LinkComponent
            key={link.key}
            link={link}
            expanded={expanded}
            linkClassName={linkClassName}
          />
        ))}
        {expanded && (
          <>
            <Divider />
            <div>
              <h1 className="font-thin text-primary-1">Your Virtual Labs</h1>
              <LabsAndProjectsCollapse />
            </div>
          </>
        )}
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
      {!expanded && <SideMenuBottom lab={lab} />}
    </div>
  );
}
