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
        <h1 className="pl-2 font-thin text-primary-3">Projects</h1>
        {virtualLabProjectsLoadable.data.results.map((project) => (
          <p className="py-2 pl-4 text-white" key={project.id}>
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
      label: <div style={{ backgroundColor: 'primary-4', color: 'white' }}>{lab.name}</div>,
      children: <VirtualLabProjects labId={lab.id} />,
    }));

    return (
      <Collapse bordered={false} ghost items={items} expandIconPosition="end" className="w-full" />
    );
  }

  // Handle loading and error states as needed
  return null;
}
