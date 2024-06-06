import Link from 'next/link';

import { auth } from '@/auth';
import PaperListView from '@/components/papers/PaperListView';
import { ServerSideComponentProp } from '@/types/common';
import retrievePapersList from '@/services/paper-ai/retrievePapersList';

export default async function PapersListing({
  params: { virtualLabId, projectId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const session = await auth();
  if (!session) return;

  const { papers, total } = await retrievePapersList({
    virtualLabId,
    projectId,
    accessToken: session.accessToken,
  });

  return (
    <div
      id="project-papers-container"
      className="relative mt-4 flex h-full max-h-[calc(100vh-9rem)] flex-col bg-white p-8"
    >
      <PaperListView {...{ total, papers }} />
      <Link
        className="mt-auto flex max-w-max items-center justify-center self-end bg-primary-8 px-8 py-4 text-white"
        type="primary"
        href={`/virtual-lab/lab/${virtualLabId}/project/${projectId}/papers/create`}
      >
        Create new paper
      </Link>
    </div>
  );
}
