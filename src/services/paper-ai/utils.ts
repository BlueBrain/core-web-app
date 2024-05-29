const PAPERS_LIST_TAG = "papers-list";

export function papersListTagGenerator({ virtualLabId, projectId }:
  { virtualLabId: string; projectId: string; }) {
  return `${PAPERS_LIST_TAG}-${virtualLabId}-${projectId}`;
}
