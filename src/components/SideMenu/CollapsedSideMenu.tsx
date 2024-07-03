import { useAtomValue } from 'jotai';
import { unwrap } from 'jotai/utils';
import { Button } from 'antd';
import Link from 'next/link';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { LabItem, LinkItem, ProjectItem } from '../VerticalLinks';

import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectDetailsAtomFamily } from '@/state/virtual-lab/projects';

import { Role } from '@/constants/virtual-labs/sidemenu';
import { classNames } from '@/util/utils';

type CollapsedSideMenuProps = {
  lab: LabItem;
  links: LinkItem[];
  project?: ProjectItem;
  toggleExpand: () => void;
};

function ProjectLink({ project, lab }: { project: ProjectItem; lab: LabItem }) {
  const projectInfo = useAtomValue(
    virtualLabProjectDetailsAtomFamily({
      virtualLabId: lab.id,
      projectId: project.id,
    })
  );

  return (
    projectInfo && (
      <div className="flex w-full flex-col items-center justify-center overflow-hidden">
        <Link
          key={lab.id}
          href={lab.href}
          className="overflow-hidden text-ellipsis whitespace-nowrap text-center font-semibold capitalize hover:text-white"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          {projectInfo?.name}
        </Link>
      </div>
    )
  );
}

export default function CollapsedSideMenu({
  lab,
  project,
  toggleExpand,
  links,
}: CollapsedSideMenuProps) {
  const virtualLab = useAtomValue(unwrap(virtualLabDetailAtomFamily(lab.id)));
  return (
    <div className="relative flex h-screen w-10 flex-col items-center gap-2 bg-primary-9 text-light transition-transform ease-in-out will-change-auto">
      <Button
        type="text"
        onClick={toggleExpand}
        className="z-20"
        icon={<PlusOutlined className="h-[14px] w-[14px] text-sm text-white" />}
      />
      <div className="flex grow flex-col items-center justify-between gap-3 overflow-hidden">
        <div className="flex w-full flex-col gap-3 overflow-hidden">
          {links
            .slice()
            .reverse()
            .map(
              (link) =>
                link.role !== Role.Scale && (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={classNames(
                      link.styles,
                      'w-[21px] font-semibold capitalize hover:text-white'
                    )}
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    {link.content}
                  </Link>
                )
            )}
          {project && <ProjectLink project={project} lab={lab} />}
        </div>
        {lab && (
          <div className="flex w-full flex-col items-center gap-2 overflow-hidden text-primary-3">
            <Link
              key={lab.id}
              href={lab.href}
              className="overflow-hidden text-ellipsis whitespace-nowrap text-center capitalize"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              {virtualLab?.name}
            </Link>
            <Link href={lab.href}>
              <HomeOutlined />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
