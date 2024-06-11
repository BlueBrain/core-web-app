import { useReducer, useRef } from 'react';
import { Button, Divider } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { LinkItem, LabItem, ProjectItem } from '../VerticalLinks';
import { LinkComponent, LabLinkComponent, ProjectLinkComponent } from './LinkComponent';
import SideMenuBottom from './SideMenuBottom';
import LabsAndProjectsCollapse from './LabsAndProjectsCollapse';
import { classNames } from '@/util/utils';

type Props = {
  links: LinkItem[];
  lab: LabItem;
  project?: ProjectItem;
};

export default function SideMenu({ links, lab, project }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, toggleExpand] = useReducer((val: boolean) => !val, false);

  return (
    <div
      ref={ref}
      className={classNames(
        'relative flex min-h-screen flex-col bg-primary-9 text-light transition-transform ease-in-out',
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
        {expanded && <LabLinkComponent lab={lab} />}

        {project && <ProjectLinkComponent project={project} expanded={expanded} />}

        {links.map((link) => (
          <LinkComponent key={link.key} link={link} expanded={expanded} />
        ))}
      </div>
      {expanded && (
        <>
          <Divider className="bg-primary-5" />
          <h1 className="text-md w-full font-thin uppercase text-primary-4">Your Virtual Labs</h1>
          <LabsAndProjectsCollapse />
        </>
      )}
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
      {!expanded && lab && <SideMenuBottom lab={lab} />}
    </div>
  );
}
