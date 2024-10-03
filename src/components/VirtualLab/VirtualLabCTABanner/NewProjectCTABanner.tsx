'use client';

import { NewProjectModal } from '../projects/VirtualLabProjectList';
import VirtualLabCTABanner from '.';
import { useAtom } from '@/state/state';
import { basePath } from '@/config';

type Props = {
  id: string;
  title: string;
  subtitle: string;
};

export default function NewProjectCTABanner({ title, subtitle, id }: Props) {
  const [, setNewProjectModalOpenAtom] = useAtom<boolean>('new-project-modal-open');
  const href = (projectId: string) => `${basePath}/virtual-lab/lab/${id}/project/${projectId}/home`;

  return (
    <>
      <VirtualLabCTABanner
        title={title}
        subtitle={subtitle}
        onClick={() => setNewProjectModalOpenAtom(true)}
      />
      <NewProjectModal
        virtualLabId={id}
        onSuccess={(project) => {
          window.location.href = href(project.id);
        }}
      />
    </>
  );
}
