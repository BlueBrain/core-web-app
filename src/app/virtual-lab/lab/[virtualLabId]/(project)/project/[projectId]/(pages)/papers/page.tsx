import PaperListView from '@/components/papers/PaperListView';
import { ServerSideComponentProp } from '@/types/common';

function PaperListPage({
  params,
}: ServerSideComponentProp<{ virtualLabId: string; projectId: string }>) {
  const { virtualLabId, projectId } = params;

  return (
    <div className="mt-4 h-[80vh] bg-white p-8 text-slate-800">
      <PaperListView virtualLabId={virtualLabId} projectId={projectId} />
    </div>
  );
}

export default PaperListPage;
