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
    virtualLabId, projectId,
    accessToken: session.accessToken,
  })

  return (
    <div
      id="project-papers-container"
      className="mt-4 max-h-[80vh] h-full bg-white p-8 flex flex-col relative"
    >
      <PaperListView {...{ total, papers }} />
      <Link
        className="bg-primary-8 px-8 py-4 flex items-center justify-center text-white max-w-max self-end mt-auto"
        type='primary'
        href={`/virtual-lab/lab/${virtualLabId}/project/${projectId}/papers/create`}
      >
        Create new paper
      </Link>
    </div>
  );
}
