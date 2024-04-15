// LabsAndProjectsCollapse.tsx
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { Collapse } from 'antd';
import { virtualLabProjectsAtomFamily } from '@/state/virtual-lab/projects';
import { virtualLabsOfUserAtom } from '@/state/virtual-lab/lab';

function VirtualLabProjects({ labId }: { labId: string }) {
  const virtualLabProjectsLoadable = useAtomValue(loadable(virtualLabProjectsAtomFamily(labId)));

  if (virtualLabProjectsLoadable.state === 'hasData') {
    return (
      <>
        {virtualLabProjectsLoadable.data.results.map((project) => (
          <p className="text-white" key={project.id}>
            {project.name}
          </p>
        ))}
      </>
    );
  }

  // Handle loading and error states as needed
  return null;
}

export default function LabsAndProjectsCollapse() {
  const virtualLabsLoadable = useAtomValue(loadable(virtualLabsOfUserAtom));

  if (virtualLabsLoadable.state === 'hasData') {
    const items = virtualLabsLoadable.data.results.map((lab) => ({
      key: lab.id,
      label: lab.name,
      children: <VirtualLabProjects labId={lab.id} />,
    }));

    return <Collapse bordered={false} ghost items={items} expandIconPosition="end" />;
  }

  // Handle loading and error states as needed
  return null;
}
