import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Button, Divider, Spin } from 'antd';
import Link from 'next/link';

import { ArrowRightOutlined, LoadingOutlined, MinusOutlined } from '@ant-design/icons';
import { LabItem, LinkItem, ProjectItem } from '../VerticalLinks';
import LabsAndProjectsCollapse from './LabsAndProjectsCollapse';

import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectDetailsAtomFamily } from '@/state/virtual-lab/projects';
import { Role } from '@/constants/virtual-labs/sidemenu';
import { useLoadableValue } from '@/hooks/hooks';

type ExpandedSideMenuProps = {
  lab: LabItem;
  project?: ProjectItem;
  links: LinkItem[];
  toggleExpand: () => void;
};

type BoxLinkProps = {
  label?: string;
  text?: ReactNode | string;
  href: string;
  id: string;
};

function BoxLink({ label, text, href, id }: BoxLinkProps) {
  return (
    <div className="flex flex-col items-start" key={id}>
      <span className="text-md mt-4 font-thin uppercase text-primary-4">{label}</span>
      <Link
        href={href}
        className="flex w-full items-center justify-between border border-primary-6 px-2 py-3 text-lg capitalize"
      >
        {text}
        <ArrowRightOutlined className="ml-2 text-primary-1" />
      </Link>
    </div>
  );
}

function ProjectLink({ project }: { project: ProjectItem }) {
  const virtualLabProjectLoadable = useLoadableValue(
    virtualLabProjectDetailsAtomFamily({
      virtualLabId: project.virtualLabId,
      projectId: project.id,
    })
  );

  if (virtualLabProjectLoadable.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  if (virtualLabProjectLoadable.state === 'hasData') {
    return (
      <BoxLink
        label="Project"
        text={virtualLabProjectLoadable.data?.name}
        href={project.href}
        id={project.id}
      />
    );
  }

  return null;
}

export default function ExpandedSideMenu({
  lab,
  project,
  links,
  toggleExpand,
}: ExpandedSideMenuProps) {
  const virtualLab = useAtomValue(unwrap(virtualLabDetailAtomFamily(lab.id)));

  return (
    <div className="relative flex min-h-screen w-80 flex-col items-start justify-start bg-primary-9 px-5 text-light shadow-[0px_5px_15px_rgba(0,0,0,.35)] transition-transform ease-in-out">
      <div className="my-6 mt-12 w-full flex-row font-semibold text-white" role="presentation">
        <BoxLink label="Virtual Lab" text={virtualLab?.name} href={lab.href} id={lab.id} />
        {project && <ProjectLink project={project} />}
        <div className="mt-8">
          {links.map(
            (link) =>
              link.role === Role.Scale && (
                <BoxLink
                  key={link.key}
                  href={link.href}
                  id={link.key}
                  label={link.label}
                  text={link.content}
                />
              )
          )}
        </div>
      </div>

      <Divider className="bg-primary-5" />
      <h1 className="text-md w-full font-thin uppercase text-primary-4">Your Virtual Labs</h1>
      <LabsAndProjectsCollapse />

      <Button
        type="text"
        onClick={toggleExpand}
        className="absolute right-1 top-5 z-20 order-2"
        icon={<MinusOutlined className="text-sm text-white" />}
      />
    </div>
  );
}
