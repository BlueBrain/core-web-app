import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Spin } from 'antd';
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { LabItem, ProjectItem, LinkItem } from '../VerticalLinks';
import { Role } from '@/constants/virtual-labs/sidemenu';
import { virtualLabDetailAtomFamily } from '@/state/virtual-lab/lab';
import { virtualLabProjectDetailsAtomFamily } from '@/state/virtual-lab/projects';
import { classNames } from '@/util/utils';

type ExpandedProp = { expanded: boolean };

type LinkProps = ExpandedProp & {
  link: LinkItem;
};

type ProjectProps = ExpandedProp & {
  project: ProjectItem;
};

type LabProps = {
  lab: LabItem;
};

type CommonLinkProps = LinkItem & { expanded?: boolean; styles?: string };

export default function CommonLinkComponent({
  key,
  label,
  content,
  href,
  expanded,
  styles = '',
}: CommonLinkProps) {
  let baseClass = classNames('flex w-full items-center justify-between capitalize', styles);
  if (expanded) baseClass = classNames(baseClass, 'py-3 px-2 border border-primary-6 text-lg');

  return (
    <div className="flex flex-col items-start" key={key}>
      {expanded && <span className="text-md mt-4 font-thin uppercase text-primary-4">{label}</span>}
      <Link href={href} className={baseClass}>
        {content}
        {expanded && <ArrowRightOutlined className="ml-2 text-primary-1" />}
      </Link>
    </div>
  );
}

export function LinkComponent({ link, expanded }: LinkProps) {
  if (link?.role === Role.Scale && !expanded) return null;

  let { styles } = link;

  if ((link.role === Role.Section || link.role === Role.Current) && expanded) {
    styles = classNames(styles, ' hidden');
  }

  return (
    <CommonLinkComponent
      key={link.key}
      label={link.label}
      content={link.content}
      href={link.href}
      expanded={expanded}
      styles={styles}
    />
  );
}

export function LabLinkComponent({ lab }: LabProps) {
  const virtualLabLoadable = useAtomValue(loadable(virtualLabDetailAtomFamily(lab.id)));

  if (virtualLabLoadable.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  if (virtualLabLoadable.state === 'hasData') {
    return (
      <CommonLinkComponent
        key={lab.key}
        label={lab.label}
        content={virtualLabLoadable.data?.name}
        href={lab.href}
        styles={lab.styles}
      />
    );
  }

  return null;
}

export function ProjectLinkComponent({ project, expanded }: ProjectProps) {
  const virtualLabProjectLoadable = useAtomValue(
    loadable(
      virtualLabProjectDetailsAtomFamily({
        virtualLabId: project.virtualLabId,
        projectId: project.id,
      })
    )
  );

  if (virtualLabProjectLoadable.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }

  if (virtualLabProjectLoadable.state === 'hasData') {
    return (
      <CommonLinkComponent
        key={project.key}
        label={project.label}
        content={virtualLabProjectLoadable.data?.name}
        href={project.href}
        expanded={expanded}
        styles={project.styles}
      />
    );
  }

  return null;
}
