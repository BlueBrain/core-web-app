'use client';

import { NewProjectModal } from '../projects/VirtualLabProjectList';
import VirtualLabCTABanner from '.';
import { useAtom } from '@/state/state';

type Props = {
  id: string;
  title: string;
  subtitle: string;
};

export default function NewProjectCTABanner({ title, subtitle, id }: Props) {
  const [, setNewProjectModalOpenAtom] = useAtom<boolean>('new-project-modal-open');

  return (
    <>
      <VirtualLabCTABanner
        title={title}
        subtitle={subtitle}
        onClick={() => setNewProjectModalOpenAtom(true)}
      />
      <NewProjectModal virtualLabId={id} />
    </>
  );
}
