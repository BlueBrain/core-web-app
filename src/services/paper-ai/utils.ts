import { PaperResource } from '@/types/nexus';
import { to64 } from '@/util/common';

const PAPERS_LIST_TAG = 'papers-list';

export function papersListTagGenerator({
  virtualLabId,
  projectId,
}: {
  virtualLabId: string;
  projectId: string;
}) {
  return `${PAPERS_LIST_TAG}-${virtualLabId}-${projectId}`;
}

export const paperHrefGenerator = ({
  projectId,
  virtualLabId,
  '@id': id,
}: Pick<PaperResource, '@id' | 'projectId' | 'virtualLabId'>) => {
  return `/virtual-lab/lab/${virtualLabId}/project/${projectId}/papers/${to64(id)}`;
};
