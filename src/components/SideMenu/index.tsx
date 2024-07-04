import { useReducer, useRef } from 'react';
import { LinkItem, LabItem, ProjectItem } from '../VerticalLinks';
import ExpandedSideMenu from './ExpandedSideMenu';
import CollapsedSideMenu from './CollapsedSideMenu';

type Props = {
  links: LinkItem[];
  lab: LabItem;
  project?: ProjectItem;
};

export default function SideMenu({ links, lab, project }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, toggleExpand] = useReducer((val: boolean) => !val, false);

  return (
    <div ref={ref}>
      {expanded ? (
        <ExpandedSideMenu lab={lab} project={project} toggleExpand={toggleExpand} links={links} />
      ) : (
        <CollapsedSideMenu links={links} lab={lab} project={project} toggleExpand={toggleExpand} />
      )}
    </div>
  );
}
