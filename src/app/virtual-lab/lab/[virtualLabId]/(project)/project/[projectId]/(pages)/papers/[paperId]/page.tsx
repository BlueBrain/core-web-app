import dynamic from 'next/dynamic';
import { LeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { ServerSideComponentProp } from '@/types/common';

const Editor = dynamic(() => import('@/components/papers/PaperEditor'), { ssr: false });

function PaperPage({
  params: { virtualLabId, projectId, paperId },
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string; paperId: string }>) {

  return (
    <div className="mt-4 h-[80vh] bg-white p-8 text-slate-800">
      <Link className="mb-18" href={`/virtual-lab/lab/${virtualLabId}/project/${projectId}/papers`}>
        <LeftOutlined /> Back to list of papers
      </Link>

      <Editor virtualLabId={virtualLabId} projectId={projectId} paperId={paperId} />
    </div>
  );
}

export default PaperPage;
