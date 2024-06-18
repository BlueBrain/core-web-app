import { PaperResource } from '@/types/nexus';
import { to64 } from '@/util/common';

const PAPERS_LIST_TAG = 'papers-list';
const PAPERS_LIST_COUNT_TAG = 'papers-list-count';
export const DEFAULT_EDITOR_STATE =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
export const DEFAULT_EDITOR_CONFIG_NAME = 'lexical-editor--state.json';
export const DEFAULT_EDITOR_CONFIG_FORMAT = 'application/json';

export function papersListTagGenerator({
  virtualLabId,
  projectId,
}: {
  virtualLabId: string;
  projectId: string;
}) {
  return `${PAPERS_LIST_TAG}-${virtualLabId}-${projectId}`;
}

export function papersListCountTagGenerator({
  virtualLabId,
  projectId,
}: {
  virtualLabId: string;
  projectId: string;
}) {
  return `${PAPERS_LIST_COUNT_TAG}-${virtualLabId}-${projectId}`;
}

export const paperHrefGenerator = ({
  projectId,
  virtualLabId,
  '@id': id,
}: Pick<PaperResource, '@id' | 'projectId' | 'virtualLabId'>) => {
  return `/virtual-lab/lab/${virtualLabId}/project/${projectId}/papers/${to64(id)}`;
};
